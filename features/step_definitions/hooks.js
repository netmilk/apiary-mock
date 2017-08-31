const {defineSupportCode} = require('cucumber');
const fs = require('fs');

let filesToCleanup = [
  'apiary.apib',
  '.apiary-mock-mockcislot1',
  'apiary-mock-mockcislot.html'
];

const fsCleanup = (callback) => {
	let filesLeft = filesToCleanup.length

	for(const file of filesToCleanup){
    fs.unlink(file, (error)=>{
      // Disregarding the error, because the file doesn't need to exist
      filesLeft -= 1;
      if(filesLeft == 0){
        return callback();
      };
    });
  };
};

defineSupportCode(function({BeforeAll, After, Before}) {
  BeforeAll(function(){
    process.env.PATH = process.env.PATH + ":./bin";
  });

  Before(function(testCase, callback) {
    fsCleanup(callback);
  });

  After(function(testCase, callback) {
    if(!this.debug){
      fsCleanup(callback);
    };
    callback();
  });
});
