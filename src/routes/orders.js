var express = require('express');
const orderController = require('../controllers/orderController');
var router = express.Router();


router.get("/queryOrders", orderController.queryOrders);

module.exports = router;
