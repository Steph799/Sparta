const Product = require('../models/product');
const mongoose = require('mongoose');
const express = require('express');
const userAuth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();
const convertRate = require('../calculate');
const { notValidProduct, idNotFound, productExist, successfulProductUpload, successfulProductDelete,
  processFailed } = require('../shared/constants');



// Get all products (admin/user/guest)
router.get('/', async (req, res) => {
  try {
    const pageNumber = Number(req.query.pageNumber)
    const pageSize = Number(req.query.pageSize)
    const length = req.query.numOfProducts ? Number(req.query.numOfProducts) : await Product.find().count();
    const products = await Product.find().sort("name").skip((pageNumber - 1) * pageSize).limit(pageSize);

    res.send({ products: products, quantity: length });
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

//get all the filtered products
router.get(`/form`, async (req, res) => {
  let products;
  let sortType = 'name';
  let length
  const pageNumber = Number(req.query.pageNumber)
  const pageSize = Number(req.query.pageSize)

  try {
    const { category, gender, range, rate, sort, input, numOfProducts } = req.query;
    if (input) {
      const regexInput = new RegExp(input, 'i');
      length = await Product.find().or([{ name: regexInput }, { company: regexInput }, { description: regexInput }]).count()
      products = await Product.find().or([{ name: regexInput }, { company: regexInput }, { description: regexInput }])
        .sort(sortType).skip((pageNumber - 1) * pageSize).limit(pageSize);
    } else {
      const filteredObj = {};

      if (category) filteredObj.category = category; //specific category (all categories=undefined)
      if (gender) filteredObj.gender = gender;
      if (range) filteredObj.price = { $gte: Number(range[0]), $lte: Number(range[1]) };
      if (rate) filteredObj.rate = { $gte: convertRate(Number(rate))[0], $lte: convertRate(Number(rate))[1] };
      if (sort) sortType = sort === 'Sort by price' ? 'price' : 'rate';

      length = numOfProducts ? Number(numOfProducts) : await Product.find(filteredObj).count()
      products = await Product.find(filteredObj).sort(sortType).skip((pageNumber - 1) * pageSize).limit(pageSize); //take 6
    }

    res.send({ products: products, quantity: length });
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

//only admin can add a product
router.post('/', [userAuth, admin], async (req, res) => {
  try {
    let product = await Product.findOne({ name: req.body.name, company: req.body.company });
    if (product) return res.status(400).send(productExist);

    const { name, company, category, gender, description, price, items, rate, image } = req.body;
    product = new Product({ name, company, category, gender, description, price, items, rate, image, });

    await product.save();
    res.send(successfulProductUpload);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

//delete product
router.delete('/:id', [userAuth, admin], async (req, res) => {
  try {
    const reqId = req.params.id;
    // Validate id parameter (format)
    const isObjectIdValid = mongoose.isValidObjectId(reqId);
    if (!isObjectIdValid) return res.status(400).send(notValidProduct);

    // Check if product exists
    const isExists = Product.exists({ _id: reqId }); 
    if (!isExists) return res.status(400).send(idNotFound);

    await Product.deleteOne({ _id: reqId })

    return res.status(200).send(successfulProductDelete);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

//update product
router.put('/:id', [userAuth, admin], async (req, res) => {
  try {
    const isObjectIdValid = mongoose.isValidObjectId(req.params.id); //not the right format
    if (!isObjectIdValid) return res.status(400).send(notValidProduct);

    //assuming the id is in the right format
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).send(idNotFound);

    res.send(product);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});

//buy product (everyone) just change the items
router.put('/purchase/:id', async (req, res) => {
  try {
    const isObjectIdValid = mongoose.isValidObjectId(req.params.id); //not the right format
    if (!isObjectIdValid) return res.status(400).send(notValidProduct);

    //assuming the id is in the right format
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).send(idNotFound);

    res.send(product);
  } catch (error) {
    res.status(500).send(`${processFailed} ${error.message}`);
  }
});


module.exports = router;



