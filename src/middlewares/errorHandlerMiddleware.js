const DefaultInternalError = require("../errors/DefaultInternalError");
const My = require("../utils/My");

function errorHandlerMiddleware(err, req, res, next) {
  
  console.log("\n\n\n############################################");
  console.log("*** General Error Handler ***");
  console.log("MyError: " + err.message);
  console.log("############################################");

  console.error(err.stack);

  // Sending an appropriate HTTP status code and error message to the client
  const defaultInternalError = new DefaultInternalError();

  res.status(defaultInternalError.status).json({
    error: defaultInternalError
  });
}


module.exports = errorHandlerMiddleware;