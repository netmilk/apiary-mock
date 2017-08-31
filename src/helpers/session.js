const fs = require('fs');
const yaml = require('js-yaml');

const session = {};

const sessionFilePath = (domain) => {
  return `./.apiary-mock-${domain}`;
}

const testConfig = (config) => {
  if(typeof config != 'object'){
    let error = new Error("Expected 'object' as a first argument");
    throw(error);
  };

  if(typeof config.domain != 'string'){
    let error = new Error("First argument object doesn't contain property 'domain' or it isn't string ");
    throw(error);
  };
}

session.save = (config, callback) => {
  try {
    testConfig(config)
  } catch(error) {
    return callback(error)
  };

  session.load(config, (error, session)=>{
    let filePath = sessionFilePath(config.domain);

    // If session is possible to load it exists -> exit
    if(error == null || session != undefined) {
      error = new Error(`Session '${filePath}' already exists`);
      return callback(error);
    }

    let data = {
      session: config.session,
      url: config.url,
      domain: config.domain
    };

    content = yaml.safeDump(data);
    fs.writeFile(filePath, content, (error) =>{
      if(error){
        return callback(error);
      }
      callback(undefined, true);
    });
  });
};

session.load = (config, callback) => {
  try {
    testConfig(config);
  } catch(error) {
    return callback(error);
  }

  filePath = sessionFilePath(config.domain);
  fs.readFile(filePath, 'utf8', (error, content) => {
    if(error){
      return callback(error);
    };

    try {
      const data = yaml.safeLoad(content);

      // This loaded data should deserve to have some validation
      // of the parsed object in `data` variable because kids can tamper with it.
      return callback(undefined, data);
    } catch(catchedError) {

      catchedError.message = catchedError.message + `\nInvalid YAML in ${filePath}`;
      return callback(catchedError);
    };
  });
};

module.exports = session

