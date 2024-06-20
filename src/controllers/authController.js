const authService = require("../services/authService");


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
      next(e);
    }
  }
};


module.exports = authController;