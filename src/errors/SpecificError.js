class SpecificError extends Error {

  constructor(message = "Specific Error", status = 401) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;

    this.friendlyErrorMessage = "Oops, something went wrong. Try again later.";    

    Error.captureStackTrace(this, this.constructor);
  }

}


module.exports = SpecificError;