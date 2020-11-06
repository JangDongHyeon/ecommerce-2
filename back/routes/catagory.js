const express = require('express');
const router = express.Router();

const { create, catagoryById, read, update, remove, list } = require('../controllers/catagory');

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { userById } = require('../controllers/user');

router.get('/categories', list);
router.get('/:categoryId', read);
router.post('/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);

router.param('categoryId', catagoryById);
router.param('userId', userById);

module.exports = router;
