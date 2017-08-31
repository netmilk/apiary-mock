const request = require('request');
const setCookieParser = require('set-cookie-parser')

const session = require('./helpers/session');
const mockStatus = require('./helpers/mock-status');

const start = {};

start.execute = (config, callback)=>{
  session.load(config, (loadError, loadedSession)=>{
    if(loadError == undefined || loadedSession != undefined){
      message = `The session '${loadedSession.domain}' already exists. \nMock URL: ${loadedSession.url}`
      loadError = new Error(message);
      loadError.statusCode = 4;
      return callback(loadError);
    };

    let url = `http://docs.${config.domain}.apiary.io/traffic`;
    let currentSession = {};
    currentSession.domain = config.domain;

    request(url, (requestError, response, body)=>{
      if(requestError){
        requestError.statusCode = 6;
        return callback(requestError);
      };
      cookies = setCookieParser.parse(response, {
         decodeValues: false
      });

      //find the 'connect.sid' cookie for 'apiary.io' domain
      for(const cookie of cookies){
        if(cookie['name'] == 'connect.sid' && cookie['domain'] == '.apiary.io'){
          currentSession.session = cookie.value;
        }
      }

      mockStatus.extract(body, (mockStatusError, result)=>{
        if(mockStatusError){return callback(mockStatusError)};
        currentSession['url'] = result.url;

        session.save(currentSession, (sessionSaveError, saveResult)=>{
          if(sessionSaveError){return callback(sessionSaveError)};
          callback(undefined, currentSession);
        });
      });
    });
  });
};

module.exports = start;
