const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config(); 
const fileUpload = require('express-fileupload');
const users = require('./routes/users');
const products = require('./routes/products');
const purchases = require('./routes/purchases');
const images = require('./routes/images');
const auth = require('./routes/auth');
const app = express();
const cors = require('cors');
const { connect, connectionFailed, port, portListening } = require('./shared/constants');

    
if (!process.env.jwtPrivateKey) {
  console.error("FATAL ERROR: JWT private key isn't define")
  process.exit(1)
} 

mongoose.connect(process.env.db, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => console.log(connect))
  .catch((error) => console.log(`${connectionFailed} ${error}`));


app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use('/api/products', products);
app.use('/api/images', images);
app.use('/api/users', users);
app.use('/api/purchases', purchases);
app.use('/api/auth', auth);

app.listen(port, () => console.log(`${portListening} ${port}...`));
