class NotFoundError extends Error {

  constructor(message = "Route Not Found Error", status = 404) {

    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;

    this.friendlyErrorMessage = "Oops, request route not found.";
    // this.detailedErrorMessage = message;

    Error.captureStackTrace(this, this.constructor);
  }

}


module.exports = NotFoundError;