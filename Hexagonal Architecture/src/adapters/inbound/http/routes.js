const express = require('express');

function createRouter(orderController) {
  const router = express.Router();

  // 주문 생성
  router.post('/', (req, res) => orderController.createOrder(req, res));

  // 모든 주문 조회
  router.get('/', (req, res) => orderController.getAllOrders(req, res));

  // 특정 주문 조회
  router.get('/:id', (req, res) => orderController.getOrder(req, res));

  // 결제 처리
  router.post('/:id/pay', (req, res) => orderController.processPayment(req, res));

  // 주문 취소
  router.post('/:id/cancel', (req, res) => orderController.cancelOrder(req, res));

  return router;
}

module.exports = createRouter;
