const {defineSupportCode} = require('cucumber');

function CustomWorld() {
  this.lastCommand = {};

  if(process.env.CUCUMBER_DEBUG == "true"){
    this.debug = true;
  } else {
    this.debug = false;
  }
};

defineSupportCode(function({setWorldConstructor}) {
  setWorldConstructor(CustomWorld)
});

