var express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const orderGuard = require('../guards/OrderGuard');
var router = express.Router();


router.get("/queryOrders", orderController.queryOrders);
router.get("/:orderId", orderController.getOrder);
router.post("/buyShippingLabel", authMiddleware.isLoggedIn, orderGuard.buyShippingLabel, orderController.buyShippingLabel);
router.put("/:orderId", authMiddleware.isLoggedIn, orderController.updateOrder);

module.exports = router;
