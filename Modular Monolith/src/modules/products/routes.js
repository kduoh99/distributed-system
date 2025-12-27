// Products 모듈 - 라우팅

const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/', controller.getProducts.bind(controller));
router.get('/:id', controller.getProduct.bind(controller));
router.post('/', controller.createProduct.bind(controller));

module.exports = router;
