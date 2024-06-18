const MyMultipleValidationErrors = require("../errors/MyMultipleValidationErrors");

function multipleErrorsErrorHandlerMiddleware(req, res, next, errors = []) {

  // Logging the error for debugging purposes
  // console.log("\n\n\n##################################");
  // console.log("MyError: Multiple Errors");
  // console.log("############################################");

  // console.error(err.stack);


  // Sending an appropriate HTTP status code and error message to the client
  const error = new MyMultipleValidationErrors();
  error.errors = errors;

  return res.status(error.status).json({
    multipleErrorsObj: error
  });
}


module.exports = multipleErrorsErrorHandlerMiddleware;