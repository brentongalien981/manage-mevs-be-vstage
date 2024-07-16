class MevNotAllowedActionError extends Error {

  constructor(message = "MEV Not Allowed Action Error", status = 401) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;

    this.friendlyErrorMessage = "Oops, that action is not allowed.";    

    Error.captureStackTrace(this, this.constructor);
  }

}


module.exports = MevNotAllowedActionError;