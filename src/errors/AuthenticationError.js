class AuthenticationError extends Error {

  constructor(message = "Authentication Error", status = 401) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;

    this.friendlyErrorMessage = "Oops, error authenticating. Try to logout or login.";
    // this.detailedErrorMessage = message;

    Error.captureStackTrace(this, this.constructor);
  }

}


module.exports = AuthenticationError;