class MyMultipleValidationErrors extends Error {

  constructor(message = "Multiple Validation Errors", status = 401) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;

    this.friendlyErrorMessage = "Oops, error validating.";
    // this.detailedErrorMessage = message;

    this.errors = [];

    Error.captureStackTrace(this, this.constructor);
  }

}


module.exports = MyMultipleValidationErrors;