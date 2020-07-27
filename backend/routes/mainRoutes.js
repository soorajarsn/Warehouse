const getControllers = require('../controllers/getControllers');
const postControllers = require('../controllers/postControllers');
const router = require('express').Router();

router.route('/').get(getControllers.home);
router.route('/api/something').get(getControllers.home);
router.route('/post/api').post(postControllers.home)

module.exports = router;