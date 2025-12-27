// Orders 모듈 - 라우팅

const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/', controller.getOrders.bind(controller));
router.get('/:id', controller.getOrder.bind(controller));
router.post('/', controller.createOrder.bind(controller));
router.get('/user/:userId', controller.getUserOrders.bind(controller));

module.exports = router;
