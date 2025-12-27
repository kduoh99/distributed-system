const express = require('express');
const OrderService = require('../services/orderService');
const UserService = require('../services/userService');

const app = express();
app.use(express.json());

const orderService = new OrderService(new UserService());

// 주문 생성 API
app.post('/api/orders', (req, res) => {
  try {
    const { userEmail, items } = req.body;
    const order = orderService.createOrder(userEmail, items);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 주문 조회 API
app.get('/api/orders/:orderId', (req, res) => {
  try {
    const order = orderService.getOrder(req.params.orderId);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// 주문 상태 변경 API
app.patch('/api/orders/:orderId/status', (req, res) => {
  try {
    const { status } = req.body;
    const order = orderService.updateOrderStatus(req.params.orderId, status);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// 테스트를 위해 app을 export (서버 시작은 하지 않음)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Order API server running on port ${PORT}`);
  });
}

module.exports = app;
