const AuthenticationError = require("../errors/AuthenticationError");
const jwt = require("jsonwebtoken");
const My = require("../utils/My");
const Admin = require("../models/admin");


const authMiddleware = {

  authenticate: async (req, res, next) => {

    // Init the default logged-in state to false.
    req.isLoggedIn = false;

    // Extract the value of the Authorization header
    const authHeader = req.headers?.authorization;

    if (authHeader) {
      // If Authorization header is present, split the header value to get the token.
      const [, token] = authHeader.split(' ');

      const validation = await validateToken(token);

      if (validation.isTokenValid) {
        // Work on authenticating a user when a valid token is passed in. 
        req.isLoggedIn = true;
        req.authUser = validation.authUser
      }
    }


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
  },

  isLoggedIn: (req, res, next) => {
    if (!req.isLoggedIn) {

      const authError = new AuthenticationError();

      return res.status(authError.status).json({
        error: authError
      });
    }

    next();
  },

};



async function validateToken(token) {

  let returnValue = {
    isTokenValid: false,
    authUser: null
  };

  if (!token) { return returnValue; }


  try {

    // Verify and decode the token        
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;
    const expiration = decoded.exp;

    // Check the token's expiration.
    if (expiration) {

      // Get the current timestamp in seconds
      const currentTimestamp = Math.floor(Date.now() / 1000);

      // Check if the expiration time is in the past
      const isExpired = expiration < currentTimestamp;

      if (!isExpired) {

        // Check if userId is valid.
        const user = await Admin.findById(userId);

        if (user) {
          returnValue.isTokenValid = true;
          returnValue.authUser = user;
        }

      }
    }

  } catch (e) {
    console.log("Error: Error validating token.");
    console.log(e.message);
  }

  return returnValue;
}


module.exports = authMiddleware;