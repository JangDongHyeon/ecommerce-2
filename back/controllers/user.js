const User = require('../models/User');
const { Order } = require('../models/order');

exports.userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id);
        if (!id.match(/^[0-9a-fA-F]{24}$/) || !user) {
            return res.status(404).json({
                msg: 'User not found'
            });
        }
        req.profile = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            msg: 'Server Error'
        });
    }
}

exports.read = (req, res) => {
    req.profile.password = undefined;
    return res.json(req.profile);
};

exports.update = async (req, res) => {
    const user = await User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true });
    user.password = undefined;
    res.json(user);
};

exports.addOrderToUserHistory = (req, res, next) => {
    let history = [];

    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        });
    });

    User.findOneAndUpdate({ _id: req.profile._id }, { $push: { history: history } }, { new: true }, (error, data) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update user purchase history'
            });
        }
        next();
    });
};

exports.purchaseHistory = (req, res) => {
    console.log(req.profile._id)
    Order.find({ user: req.profile._id })
        .populate('user', '_id name')
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            res.json(orders);
        });
};