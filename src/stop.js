const request = require('request');
const fs = require('fs');
const path = require('path');
const Inliner = require('inliner');

const session = require('./helpers/session');
const mockStatus = require('./helpers/mock-status')


const stop = {};

stop.execute = (config, callback)=>{

  // Lookup for an existin session
  session.load(config, (sessionError, currentSession)=>{
    if(sessionError){return callback(sessionError)};

    let baseUrl = `http://docs.${currentSession.domain}.apiary.io`;
    let pathSegment = "/traffic";
    let url = baseUrl + pathSegment;

    // Setup the cookie
    let jar = request.jar();
    let cookieString = "connect.sid=" + currentSession.session;
    let cookie = request.cookie(cookieString);
    jar.setCookie(cookie, baseUrl);

    // Fetch the mock
    request.get({url, jar}, (requestError, response, body)=>{
      if(requestError){return callback(requestError)};

      // Query the status
      mockStatus.extract(body, (validationError, validationResult )=>{
        if(validationError){return callback(validationResult)};

        // This is important. I'm checking the Mock URL of the retrieved
        // HTML vs the one in the session file in the runtime. If that is different it meanse
        // the dirty hacky HTTP Cookie session id ('cookie.sid') didn't work and this POC tool
        // is queruing a different mock for as status during 'stop' then the one 'start'
        // returned. Ideally this should query some Apiary Mock creation API they didn't have
        // at the time of creation of this tool.
        if(validationResult.url != currentSession.url){
          let error = new Error("TOLD YOU! PANIC: This tool doesn't work. " +
              "Read the source code of everything and fix it or dont' use it and throw it away.");
          error.statusCode = 6;
          return callback(error);
        };
        let cookieHeader = "Cookie:" + cookieString;
        let inlinerConfig = {
          skipAbsoluteUrls: true,
          header: cookieHeader,
          encoding: "utf-8"
        };

        // Fetch and squash the report
        new Inliner(url, inlinerConfig, function(inlinerError, data){
          if(inlinerError){return callback(inlinerError)};

          let reportFile = `apiary-mock-${currentSession.domain}.html`
          // Save the report
          fs.writeFile(reportFile, data, (writeError)=> {
            if(writeError){return callback(writeError)};

            reportUrl = "file://" + path.join(process.cwd(), reportFile);
            validationResult.report = reportUrl;

            let filePath = `.apiary-mock-${currentSession.domain}`;
            // Delete the session file
            fs.unlink(filePath, (unlinkError) =>{
              if(unlinkError){return callback(unlinkError)};
              callback(null, validationResult);
            });
          });
        });
      });
    });
  });
};

module.exports = stop;
