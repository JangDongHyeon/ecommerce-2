const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/Product');
const {
    errorHandler
} = require('../helpers/dbErrorHandler');

exports.productById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id).populate('category');
        if (!id.match(/^[0-9a-fA-F]{24}$/) || !product) {
            return res.status(404).json({
                msg: 'Product not found'
            });
        }

        req.product = product;
        next();
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            msg: 'Server Error'
        });
    }
}


exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};


exports.create = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {

        if (err) {
            return res.status(400).json({
                msg: 'Image could not be uploaded'
            });
        }

        // check for all fields
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }
        console.log('fields:', fields);
        let product = new Product(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                console.log('PRODUCT CREATE ERROR ', err);
                return res.status(400).json({
                    msg: "server Err"
                });
            }
            res.json(result);
        });
    });
};

exports.remove = async (req, res) => {
    try {
        let product = req.product;
        await product.remove();
        res.json({
            msg: 'Product deleted successfully'
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            msg: errorHandler(err)
        });
    }
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let product = req.product;
        product = await _.extend(product, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.list = async (req, res) => {
    try {
        let order = req.query.order ? req.query.order : 'asc';
        let limit = req.query.limit ? parseInt(req.query.limit) : 6;

        let sortBy = req.query.sortBy ? req.query.sortBy : '_id';


        const product = await Product.find()
            .select('-photo')
            .populate('category')
            .sort([
                [sortBy, order]
            ])
            .limit(limit);

        res.json({
            product
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            err: 'server Error'
        });
    }
}

exports.listRelated = async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 6;
        //공통적인거 제거
        const product = await Product.find({
            _id: {
                $ne: req.product
            },
            category: req.product.category
        })
            .limit(limit)
            .populate('category', '_id name');
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(400).json({
            err: 'server Error'
        });
    }
};

exports.listCategories = async (req, res) => {
    try {
        //중복제거 
        const categories = await Product.distinct('category', {});

        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(400).json({
            err: 'server Error'
        });
    }
};


exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        // assigne category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select('-photo');
    }
};

exports.listBySearch = async (req, res) => {
    try {
        let order = req.body.order ? req.body.order : 'desc';
        let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
        let limit = req.body.limit ? parseInt(req.body.limit) : 100;
        let skip = parseInt(req.body.skip);
        let findArgs = {};
        console.log(skip)
        for (let key in req.body.filters) {
            if (req.body.filters[key].length > 0) {
                if (key === 'price') {
                    // gte -  greater than price [0-10]
                    // lte - less than
                    findArgs[key] = {
                        $gte: req.body.filters[key][0],
                        $lte: req.body.filters[key][1]
                    };
                } else {
                    findArgs[key] = req.body.filters[key];
                }
            }
        }

        const product = await Product.find(findArgs)
            .select('-photo')
            .populate('category')
            .sort([
                [sortBy, order]
            ])
            .skip(skip)
            .limit(limit);
        res.json({
            size: product.length,
            data: product
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            err: 'server Error'
        });
    }
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};


exports.decreaseQuantity = (req, res, next) => {
    //하나의 값을 업데이틑 하는데 inc 써서 양수 음수 뺴고 더하기 가능함.
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });
    //bulkWrite는 대량의 업데이트 하는거
    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update product'
            });
        }
        next();
    });
};


