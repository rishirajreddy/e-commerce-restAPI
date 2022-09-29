const express = require('express');
const router = express.Router();
const prodController = require("../controllers/prodController");

router.post("/create", prodController.createProduct);
router.get("/getAll", prodController.getAllProducts);
router.get("/:id", prodController.getProduct);
router.patch("/:id", prodController.updateProduct);

module.exports = router;