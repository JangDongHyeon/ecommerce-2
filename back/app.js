const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
const app = express();

require('dotenv').config();
require('./db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const catagoryRoutes = require('./routes/catagory');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');

//Middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(morgan('dev'));
app.use(expressValidator());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/category', catagoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api', braintreeRoutes);


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server isd running on port ${port}`);
});