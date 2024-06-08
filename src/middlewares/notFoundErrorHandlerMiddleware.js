const NotFoundError = require("../errors/NotFoundError");
const My = require("../utils/My");

function notFoundErrorHandlerMiddleware(req, res, next) {

  // Logging the error for debugging purposes
  console.log("\n\n\n##################################");
  console.log("MyError: Route not found");
  console.log("############################################");

  // console.error(err.stack);


  // Sending an appropriate HTTP status code and error message to the client
  const error = new NotFoundError();

  res.status(error.status).json({
    error: error
  });
}


module.exports = notFoundErrorHandlerMiddleware;