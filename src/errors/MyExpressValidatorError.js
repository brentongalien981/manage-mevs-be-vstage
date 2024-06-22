const MyMultipleValidationErrors = require("./MyMultipleValidationErrors");

class MyExpressValidatorError extends MyMultipleValidationErrors {
  constructor({ message = "My Express Validator Error", validationErrors = [] }) {
    super(message);
    this.setErrors(validationErrors);
  }

  setErrors(validationErrors) {
    const errorsArr = [];

    for (const e of validationErrors) {
      errorsArr.push({
        field: e.path,
        message: e.msg
      });      
    }

    this.errors = errorsArr;
  }
}

module.exports = MyExpressValidatorError;