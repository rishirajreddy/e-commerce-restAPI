const express = require('express');
const router = express.Router();
const ordersController  = require("../controllers/orderController");
const checkToken  = require("../middlewares/check_token");

router.post("/placeOrder/:id", checkToken.checkToken,ordersController.placeOrder);
router.get("/all", ordersController.getAllOrders);
router.get("/", checkToken.checkToken, ordersController.getClientOrders);
router.delete("/delete", checkToken.checkToken,ordersController.deleteOrder);

module.exports = router;