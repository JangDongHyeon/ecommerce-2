const Catagory = require('../models/Catagory');
const Product = require('../models/Product');
const {
    errorHandler
} = require('../helpers/dbErrorHandler');

exports.catagoryById = async (req, res, next, id) => {
    try {
        const catagory = await Catagory.findById(id);
        if (!id.match(/^[0-9a-fA-F]{24}$/) || !catagory) {
            return res.status(404).json({
                msg: 'Catagory not found'
            });
        }
        // if (!user)
        //     return res.status(400).json({
        //         msg: 'User not found'
        //     });
        req.category = catagory;
        next();
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            msg: 'Server Error'
        });
    }
};

exports.create = async (req, res) => {
    try {
        console.log(req.body)
        const catagory = await new Catagory(req.body);
        await catagory.save();
        res.json({
            catagory
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            msg: 'server Error'
        });
    }
};

exports.read = (req, res) => {
    return res.json(req.category);
};

exports.update = async (req, res) => {
    try {
        const category = req.category;
        category.name = req.body.name;
        await category.save();
        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(400).json({
            msg: errorHandler(err)
        });
    }
};

exports.remove = async (req, res) => {
    try {
        const category = req.category;
        const product = await Product.find({
            category
        });
        if (product.length >= 1) {
            return res.status(400).json({
                msg: `Sorry. You cant delete ${category.name}. It has ${product.length} associated products.`
            });
        }
        await category.remove();

        res.json({
            msg: 'Category deleted'
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            msg: errorHandler(err)
        });
    }
};

exports.list = async (req, res) => {
    try {
        const catagory = await Catagory.find();

        res.json(catagory);
    } catch (err) {
        console.error(err);
        res.status(400).json({
            msg: errorHandler(err)
        });
    }
};