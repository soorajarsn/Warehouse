const getControllers = require('../controllers/getControllers');
const postControllers = require('../controllers/postControllers');
const deleteControllers = require('../controllers/deleteControllers');
const putControllers = require('../controllers/putControllers');
const router = require('express').Router();

//getControllers
router.route('/api/getProducts').get(getControllers.getProducts);
router.route('/api/loadUser').get(getControllers.user);
router.route('/api/addresses').get(getControllers.addresses);
router.route('/api/cart').get(getControllers.cart);
router.route('/api/product/:id').get(getControllers.product);
router.route('/api/orders').get(getControllers.orders);
//postControllers
router.route('/post/saveProduct').post(postControllers.saveProduct);
router.route('/post/signup').post(postControllers.signup);
router.route('/post/login').post(postControllers.login);
router.route('/post/recover').post(postControllers.recover);
router.route('/post/createAddress').post(postControllers.address);
router.route('/post/addCart').post(postControllers.addCart);
router.route('/post/createOrder').post(postControllers.createRazorpayOrder);
router.route('/post/paymentVerification/razorpay').post(postControllers.paymentVerificationRazorpay);
router.route('/post/paymentVerification/client').post(postControllers.paymentVerificationClient);
//deleteControllers
router.route('/api/address').delete(deleteControllers.address);
router.route('/post/removeCart').delete(deleteControllers.removeCart);
router.route('/api/clearCart').delete(deleteControllers.clearCart);
//putControllers
router.route('/api/address').put(putControllers.address);
router.route('/api/updateCart').put(putControllers.updateCart);
module.exports = router;