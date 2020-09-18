const getControllers = require('../controllers/getControllers');
const postControllers = require('../controllers/postControllers');
const deleteControllers = require('../controllers/deleteControllers');
const putControllers = require('../controllers/putControllers');
const router = require('express').Router();

//getControllers
router.route('/api/getProducts').get(getControllers.getProducts);
router.route('/api/loadUser').get(getControllers.user);
router.route('/api/addresses').get(getControllers.addresses);
router.route('/api/cart').get(getControllers.getProducts);
//postControllers
router.route('/post/saveProduct').post(postControllers.saveProduct);
router.route('/post/signup').post(postControllers.signup);
router.route('/post/login').post(postControllers.login);
router.route('/post/recover').post(postControllers.recover);
router.route('/post/createAddress').post(postControllers.address);
router.route('/post/addCart').post(postControllers.addCart);
//deleteControllers
router.route('/api/address').delete(deleteControllers.address);
router.route('/post/removeCart').delete(deleteControllers.removeCart);
//putControllers
router.route('/api/address').put(putControllers.address);
module.exports = router;