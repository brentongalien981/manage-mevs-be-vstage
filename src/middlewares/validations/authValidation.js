const { body, validationResult } = require("express-validator");
const multipleErrorsErrorHandlerMiddleware = require("../multipleErrorsErrorHandlerMiddleware");
const { signupKeyEqualityValidator, SIGNUP_KEY_EQUALITY_VALIDATION_ERROR_MSG, passwordRegexValidator, PASSWORD_REGEX_VALIDATION_ERROR_MSG } = require("../../utils/validators/UserValidator");
const MyExpressValidatorError = require("../../errors/MyExpressValidatorError");

const authValidation = {

  signup: [
    validateSingupKey(),
    validatePassword(),
    handleValidationResults
  ],

  login: [
    validatePassword(),
    handleValidationResults
  ]

};


function validateSingupKey() {
  return [
    body("signupKey").trim().escape()
      .notEmpty().withMessage("Signup Key is required")
      .custom((value) => {
        const isOk = signupKeyEqualityValidator(value);

        if (!isOk) {
          throw new Error(SIGNUP_KEY_EQUALITY_VALIDATION_ERROR_MSG);
        }

        return true;
      })
  ];
}


function validatePassword() {
  return [
    body("password").trim().escape()
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
      .isLength({ max: 32 }).withMessage("Password must be at most 32 characters")
      .custom((value) => {
        const isOk = passwordRegexValidator(value);

        if (!isOk) {
          throw new Error(PASSWORD_REGEX_VALIDATION_ERROR_MSG);
        }

        return true;
      })
  ];
}



function handleValidationResults(req, res, next) {
  const errors = validationResult(req);

  // On error
  if (!errors.isEmpty()) {
    const err = new MyExpressValidatorError({ validationErrors: errors.array() });
    return multipleErrorsErrorHandlerMiddleware(err, req, res, next);
  }

  // On success    
  next();
}


module.exports = authValidation;