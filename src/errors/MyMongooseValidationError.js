const MyMultipleValidationErrors = require("./MyMultipleValidationErrors");

class MyMongooseValidationError extends MyMultipleValidationErrors {
  constructor({ message = "My Mongoose Validation Error", validationErrors = {} }) {
    super(message);
    this.setErrors(validationErrors);
  }

  setErrors(validationErrors) {
    const errorsArr = [];

    for (const errorKey in validationErrors) {
      const e = validationErrors[errorKey];
      errorsArr.push({
        field: e.path,
        message: e.message
      });
    }

    this.errors = errorsArr;
  }
}

module.exports = MyMongooseValidationError;