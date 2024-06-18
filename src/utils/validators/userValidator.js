// Consts
const EMAIL_MIN_LENGTH = 7;
const EMAIL_MAX_LENGTH = 64;


// Validation errors messages.
const EMAIL_MIN_LENGTH_VALIDATION_ERROR_MSG = `Email must be at least ${EMAIL_MIN_LENGTH} characters.`;
const EMAIL_MAX_LENGTH_VALIDATION_ERROR_MSG = `Email must be at most ${EMAIL_MAX_LENGTH} characters.`;
const EMAIL_REGEX_VALIDATION_ERROR_MSG = `Invalid email.`;

const PASSWORD_REGEX_VALIDATION_ERROR_MSGS = [
  `Password must contain at least one lowercase letter.`,
  `Password must contain at least one uppercase letter.`,
  `Password must contain at least one number.`,
  `Password must contain at least one special character like (!@#$%^&*).`,
];
const PASSWORD_REGEX_VALIDATION_ERROR_MSG = PASSWORD_REGEX_VALIDATION_ERROR_MSGS.join(' ');

const SIGNUP_KEY_EQUALITY_VALIDATION_ERROR_MSG = `Signup Key is invalid.`;



// Validator funcs.
function emailMinLengthValidator() {
  return [
    EMAIL_MIN_LENGTH,
    EMAIL_MIN_LENGTH_VALIDATION_ERROR_MSG
  ];
}

function emailMaxLengthValidator() {
  return [
    EMAIL_MAX_LENGTH,
    EMAIL_MAX_LENGTH_VALIDATION_ERROR_MSG
  ];
}

function emailRegexValidator(val) {
  const regex = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
  return regex.test(val);
}

function passwordRegexValidator(val) {
  const regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$');
  return regex.test(val);
}

function signupKeyEqualityValidator(val) {
  return val === process.env.SIGNUP_KEY;
}


// Validator arrays.
const emailValidators = [
  { validator: emailRegexValidator, message: EMAIL_REGEX_VALIDATION_ERROR_MSG }
];

const passwordValidators = [
  { validator: passwordRegexValidator, message: PASSWORD_REGEX_VALIDATION_ERROR_MSG }
];

const signupKeyValidators = [
  { validator: signupKeyEqualityValidator, message: SIGNUP_KEY_EQUALITY_VALIDATION_ERROR_MSG }
];


module.exports = {
  SIGNUP_KEY_EQUALITY_VALIDATION_ERROR_MSG,
  PASSWORD_REGEX_VALIDATION_ERROR_MSG,
  emailMinLengthValidator,
  emailMaxLengthValidator,
  emailRegexValidator,
  passwordRegexValidator,
  signupKeyEqualityValidator,
  emailValidators,
  passwordValidators,
  signupKeyValidators
};