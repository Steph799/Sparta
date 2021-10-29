const mongoose = require('mongoose');
const { descriptionMinLen, reqNum, descriptionMaxLen, reqString, itemsMessage, maxRate } = require('../shared/constants');


const productSchema = new mongoose.Schema({
  name: reqString,
  company: reqString,
  category: { type: String, required: true, default: 'All categories' },
  gender: { type: String, default: 'all', required: true },
  description: { type: String, required: true, minLength: descriptionMinLen, maxLength: descriptionMaxLen },
  price: reqNum,
  items: { type: Number, min: 0, validate: { validator: Number.isInteger, message: itemsMessage, }, required: true },
  rate: { type: Number, min: 0, max: maxRate, required: true },
  image: { type: String, required: false },
});

module.exports = Product = mongoose.model('Product', productSchema);



