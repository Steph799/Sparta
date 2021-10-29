const Cart = require('../models/cart');
const express = require('express');
const router = express.Router();
const { successfulPurchase, processFailed} = require('../shared/constants');

router.post('/', async (req, res) => {
  try {
    cart = new Cart({
      soldProducts: req.body.soldProducts,
      buyer: req.body.buyer,
      totalPrice: req.body.totalPrice,
      time: new Date().toLocaleString()
    });

    await cart.save();
    res.send(successfulPurchase);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

module.exports = router;
