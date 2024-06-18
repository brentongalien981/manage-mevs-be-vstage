const authController = {
  signup: (req, res, next) => {
    try {
      res.status(201).json({
        msg: "Request OK for POST route: /auth/signup"
      });
    } catch (e) {
      next(e);
    }
  }
};


module.exports = authController;