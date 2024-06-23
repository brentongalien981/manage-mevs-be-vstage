const AuthenticationError = require("../errors/AuthenticationError");
const MyMongooseDuplicateKeyError = require("../errors/MyMongooseDuplicateKeyError");
const MyMongooseValidationError = require("../errors/MyMongooseValidationError");
const multipleErrorsErrorHandlerMiddleware = require("../middlewares/multipleErrorsErrorHandlerMiddleware");
const specificErrorHandlerMiddleware = require("../middlewares/specificErrorHandlerMiddleware");
const authService = require("../services/authService");
const My = require("../utils/My");


const authController = {
  signup: async (req, res, next) => {

    try {
      const { token, email } = await authService.signup(req);

      res.status(201).json({
        msg: "Request OK for POST route: /auth/signup",
        token: token,
        email: email
      });
    } catch (e) {
      // Handle MongoDB CastError and ValidationError.      
      if (e.name === "ValidationError") {
        const error = new MyMongooseValidationError({ validationErrors: e.errors });
        return multipleErrorsErrorHandlerMiddleware(error, req, res, next);
      }

      // Handle Mongoose duplicate key error.
      if (e.code === 11000) {
        // Extract the field that caused the duplicate key error
        const field = Object.keys(e.keyPattern)[0];
        const customDuplicateErrorObj = {
          [field]: {
            path: field,
            message: `${field} already exists.`,
          }

        };
        const error = new MyMongooseDuplicateKeyError({ validationErrors: customDuplicateErrorObj })
        return multipleErrorsErrorHandlerMiddleware(error, req, res, next);
      }


      // For other errors.
      next(e);
    }
  },

  login: async (req, res, next) => {

    try {
      const { token, email } = await authService.login(req);

      if (!token) {
        throw new AuthenticationError();
      }

      res.status(200).json({
        msg: `Request OK for ${req.method} route: ${req.originalUrl}`,
        token: token,
        email: email
      });
    } catch (e) {

      // Handle AuthenticationError.
      if (e.name === "AuthenticationError") {
        return specificErrorHandlerMiddleware(e, req, res, next);
      }

      // For other errors.
      next(e);
    }
  }
};


module.exports = authController;