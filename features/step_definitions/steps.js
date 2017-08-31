const {defineSupportCode} = require('cucumber');
const childProcess = require('child_process');
const fs = require('fs');
const {assert} = require('chai');
const parser = require('http-string-parser');
const request = require('request');

defineSupportCode(function({Given, When, Then}) {
	Given('I have exported the APIARY_API_KEY environment variable', function (callback) {
    if(!process.env.APIARY_API_KEY){
      callback(new Error('APIARY_API_KEY environment vairable not found'));
    } else {
      callback();
    };
	});

  Given('I have a following API description document saved in {string}:', function (filePath, docString, callback) {
    // Save this to the World
    this.adPath = filePath
    fs.writeFile(this.adPath, docString, function(err) {
      if(err){return callback(err)}else( callback());
    });
  });

  Given('I make following {string} HTTP request to the Mock URL:', function (type, requestString, callback) {
    //Extract Mock URL from the last command
		if(!this.mockUrl){
      let lines = this.lastCommand.stdout.split('\n');
      let lastLine = lines[lines.length -2];
      this.mockUrl = lastLine.split(": ")[1];
    };

    let parsedRequest = parser.parseRequest(requestString);
    // Remove Host header from the example and let the 'request' library do its job
    delete parsedRequest.headers['Host'];
    // Make 'uri' property 'request' library compatible = the full URL
    parsedRequest.uri = this.mockUrl + parsedRequest.uri

    request(parsedRequest, (error, response)=>{
      if(error){return callback(error)};
      callback();
    });
  });

  When('I run {string}', function (command, callback) {
    let execOptions = {
      "shell": "/usr/local/bin/bash",
      "env": process.env
    };

    this.lastCommand.command = command;

    var child = childProcess.exec(command, execOptions, (error, stdout, stderr) => {
      if(this.debug){console.log(stdout)};
      if(this.debug){console.log(stderr)};
      if(this.debug && error){ console.log(error)};

      this.lastCommand.stdout = stdout;
      this.lastCommand.stderr = stderr;
    });

    child.on('close', (status) => {
      this.lastCommand.statusCode = status
      return callback();
    })
  });

  Then('the exit code is {string}', function (string, callback) {
    assert.equal(this.lastCommand.statusCode, string);
    return callback();
  });

  Then('I can see the mock URL in the console', function (callback) {
    assert.include(this.lastCommand.stdout, 'http://');
    assert.include(this.lastCommand.stdout, 'Mock');
    callback();
  });

  Then('the session file {string} was saved', function (sessionFile, callback) {
    fs.stats(sessionFile, (stats) => {
      assert.isTrue(stats.isFile());
      return callback();
    });
  });

 	Then('I can\'t see text {string} in the console', function (string, callback) {
    assert.notInclude(this.lastCommand.stdout, string)
	  callback();
	});

 	Then('I can see text {string} in the console', function (string, callback) {
    assert.include(this.lastCommand.stdout, string)
	  callback();
	});

  Then('I can see the path to the HTML report in the console', function (callback) {
    assert.include(this.lastCommand.stdout, "Report");
    assert.include(this.lastCommand.stdout, ".html");
    callback();
  });
});
