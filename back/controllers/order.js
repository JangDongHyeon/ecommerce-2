const { Order } = require('../models/order');
exports.orderById = (req, res, next, id) => {
    Order.findById(id)
        .populate('products.product', 'name price')
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.order = order;
            next();
        });
};

exports.create = async (req, res) => {
    try {
        req.body.order.user = req.profile;
        const order = await new Order(req.body.order);
        await order.save();
        res.json(order)
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            msg: 'Server Error'
        });
    }
    console.log('CREATE', req.body);
}

exports.listOrders = (req, res) => {
    try {
        Order.find()
            .populate('user', '_id name address')
            .sort('-created')
            .exec((err, orders) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(error)
                    });
                }
                res.json(orders);
            });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            msg: 'Server Error'
        });
    }
};

exports.getStatusValues = (req, res) => {
    //eum 값 보내기 
    console.log(Order.schema.path('status').enumValues)
    res.json(Order.schema.path('status').enumValues);
};


exports.updateOrderStatus = (req, res) => {
    try {
        Order.update({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(order);
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            msg: 'Server Error'
        });
    }
}