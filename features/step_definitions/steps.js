const {defineSupportCode} = require('cucumber');
const childProcess = require('child_process');
const fs = require('fs');
const {assert} = require('chai');


defineSupportCode(function({Given, When, Then}) {
  Given('I have a following API description document saved in {string}:', function (filePath, docString, callback) {
    // Save this to the World
    this.filePath = filePath
    fs.writeFile(this.filePath, docString, function(err) {
      return callback(err);
    }); 
  });

  Given('I push it to Apiary', function (callback) {
    let command = `apiary publish --api-name=${this.apiName} --path=${this.filePath}`;
    let execOptions = {
      "shell": "/usr/local/bin/bash",
      "env": {
        "APIARY_API_KEY": this.apiKey,
        "PATH": process.env.PATH
      }
    };
    
    childProcess.exec(command, execOptions, function (error, stdout, stderr) {
      this.lastCommand = {
        "stdout": stdout,
        "stderr": stderr
      };
      return callback(error);
    });
  });

  When('I run {string}', function (command, callback) {
    let execOptions = {
      "shell": "/usr/local/bin/bash",
      "env": {
        "PATH": process.env.PATH + ":./bin"
      }
    };
    
    var child = childProcess.exec(command, execOptions, (error, stdout, stderr) => {
      if(error){
        return error;
      }
     
     this.lastCommand.stdout = stdout
     this.lastCommand.stderr = stderr
    });
    
    child.on('close', (status) => {
      this.lastCommand.statusCode = status
      return callback();
    })  
  });

  Then('the exit code is {string}', function (string, callback) {
    assert.equal(this.lastCommand.statusCode, 0);
    return callback();
  });

  Then('I see the mock URL in the console', function (callback) {
    assert.include(this.lastCommand.stdout, 'http://');
    assert.include(this.lastCommand.stdout, 'mock');
    callback();
  });

  Then('the session file {string} was saved', function (sessionFile, callback) {
    fs.stats(sessionFile, (stats) => {
      assert.isTrue(stats.isFile());
      return callback();
    });
  });
});
