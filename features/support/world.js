const {defineSupportCode} = require('cucumber');

function CustomWorld() {
  this.browser = "betchya";

  this.lastCommand = {};

  this.apiKey = "4e9753797498bd8c4974a8465205172d";
  this.apiName = "mockslot1";
  
  // This is going to be filled by the AD creation step
  this.filePath = null;
}

defineSupportCode(function({setWorldConstructor}) {
  setWorldConstructor(CustomWorld)
})
