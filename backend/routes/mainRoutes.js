const getControllers = require('../controllers/getControllers');
const postControllers = require('../controllers/postControllers');
const router = require('express').Router();

router.route('/10').get(getControllers.home);

router.route('/1').post(postControllers.home)

module.exports = router;