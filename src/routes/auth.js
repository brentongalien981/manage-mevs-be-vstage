var express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const authValidation = require('../middlewares/validations/authValidation');
var router = express.Router();

router.post("/signup", authMiddleware.isGuest, authValidation.signup, authController.signup);
router.post("/login", authMiddleware.isGuest, authValidation.login, authController.login);

module.exports = router;
