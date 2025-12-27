

const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/', controller.getUsers.bind(controller));
router.get('/:id', controller.getUser.bind(controller));
router.post('/', controller.createUser.bind(controller));

module.exports = router;
