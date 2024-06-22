function multipleErrorsErrorHandlerMiddleware(err, req, res, next) {

  if (process.env.NODE_ENV === "development") {
    console.log("\n\n\n############################################");
    console.log("MyError: Multiple Errors");
    console.log("############################################");

    console.error(err);
  }

  // Sending an appropriate HTTP status code and error message to the client
  return res.status(err.status).json({
    multipleErrorsObj: err
  });
}


module.exports = multipleErrorsErrorHandlerMiddleware;