const mongoose = require('mongoose');
const { minId, maxId, reqNum, names, reqString} = require('../shared/constants');


//every purchase is a cart (even one item)
const cartSchema = new mongoose.Schema({
  soldProducts: [{ name: reqString, company: reqString, price: reqNum, copies: reqNum }],
  buyer: {firstName: names, lastName: names, id: { type: Number, min: minId, max: maxId, required: true }},
  totalPrice: { type: Number, min: 1, required: true },
  time: { type: String, required: true }
});

module.exports = Cart = mongoose.model('Cart', cartSchema);



