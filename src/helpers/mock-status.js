const cheerio = require('cheerio');

let mockStatus = {};

mockStatus.extract = (html, callback)=> {
  const $ = cheerio.load(html);

  // Request callass element classes:
  // hit - documented, valid
  // miss - undocumented
  // err - documented, invalid

  let trafficViewer = $('#trafficViewer');
  let urlElement = $('span.mockURL');

  if(trafficViewer.length == 0 || urlElement.length == 0){
    error = new Error("The data isn't Apiary Mock HTML");
    error['statusCode'] = 5;
    return callback(error);
  };

  let hitRequests = $('.request.hit');
  let missRequests = $('.request.miss');
  let errRequests = $('.request.err');

  let url = urlElement.html()

  let result = {};
  result.url = url;

  if(errRequests.length > 0){
    result['statusCode'] = 1;
    result['message'] = "Contract validation failed. Some API calls were invalid.";

  } else if(errRequests.length == 0 && hitRequests.length > 0 && missRequests == 0) {
    result['statusCode'] = 0;
    result['message'] = "Contract validation passed. All API calls OK.";

  } else if(errRequests.length == 0 && missRequests.length > 0) {
    result['statusCode'] = 2;
    result['message'] = "Contract validation failed. Some API cales were undocumented."

  } else if(errRequests.length == 0 && missRequests.length == 0 && hitRequests == 0) {
    result['statusCode'] = 3;
    result['message'] = "Contract validation failed. There were no API calls.";

  };
  callback(undefined, result);
};

module.exports = mockStatus;

