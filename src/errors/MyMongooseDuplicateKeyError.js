const MyMultipleValidationErrors = require("./MyMultipleValidationErrors");

class MyMongooseDuplicateKeyError extends MyMultipleValidationErrors {
  constructor({ message = "My Mongoose Duplicate Key Error", validationErrors = {} }) {
    super(message, 409);
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

module.exports = MyMongooseDuplicateKeyError;