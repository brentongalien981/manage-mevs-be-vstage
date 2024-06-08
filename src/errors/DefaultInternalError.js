class DefaultInternalError extends Error {

  constructor(message = "Default Internal Error", status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;

    this.friendlyErrorMessage = "Oops, something went wrong. Please try again later.";
    // this.detailedErrorMessage = message;

    Error.captureStackTrace(this, this.constructor);
  }

}


module.exports = DefaultInternalError;