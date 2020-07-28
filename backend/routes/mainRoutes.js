const getControllers = require('../controllers/getControllers');
const postControllers = require('../controllers/postControllers');
const router = require('express').Router();

// router.route('/').get(getControllers.home);
router.route('/api/getProducts').get(getControllers.getProducts);
router.route('/post/saveProduct').post(postControllers.saveProduct);
router.route('/post/signup').post(postControllers.signup);
router.route('/post/login').post(postControllers.login);
module.exports = router;