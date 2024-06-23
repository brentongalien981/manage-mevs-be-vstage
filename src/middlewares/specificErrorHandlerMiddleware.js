function specificErrorHandlerMiddleware(err, req, res, next) {

  if (process.env.NODE_ENV === "development") {
    console.log("\n\n\n############################################");
    console.log("*** Specific Error Handler ***");
    console.log("MyError: " + err.message);
    console.log("############################################");

    console.error(err.stack);
  }


  res.status(err.status).json({
    error: err
  });
}


module.exports = specificErrorHandlerMiddleware;