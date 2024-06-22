const AuthenticationError = require("../errors/AuthenticationError");
const jwt = require("jsonwebtoken");
const My = require("../utils/My");


const authMiddleware = {

  authenticate: async (req, res, next) => {

    // TODO: Delete.
    await My.sleep(1000);
    // Init the default logged-in state to false.
    req.isLoggedIn = false;

    // TODO: Re-code this when using authMiddleware.isLoggedIn.
    // // Extract the value of the Authorization header
    // const authHeader = req.headers?.authorization;

    // if (authHeader) {
    //   // If Authorization header is present, split the header value to get the token.
    //   const [, token] = authHeader.split(' ');

    //   const validation = await validateToken(token);

    //   if (validation.isTokenValid) {
    //     // Work on authenticating a user when a valid token is passed in. 
    //     req.isLoggedIn = true;
    //     req.authUser = validation.authUser
    //   }
    // }


    next();

  },

  isGuest: (req, res, next) => {

    if (req.isLoggedIn) {

      const authError = new AuthenticationError();

      return res.status(authError.status).json({
        error: authError
      });
    }

    next();
  }

};


module.exports = authMiddleware;