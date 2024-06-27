var express = require('express');
const My = require('../utils/My');
const dashboardController = require('../controllers/dashboardController');
var router = express.Router();

router.post("/query", dashboardController.query);

module.exports = router;
