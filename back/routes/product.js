const express = require('express');
const router = express.Router();

const {
    create,
    productById,
    read,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo,
    listSearch
} = require('../controllers/product.js');

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { userById } = require('../controllers/user');



router.get("/products", list);
router.get("/products/search", listSearch);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.get("/photo/:productId", photo);

router.get("/:productId", read);
router.post("/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
    "/:productId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.put(
    "/:productId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
