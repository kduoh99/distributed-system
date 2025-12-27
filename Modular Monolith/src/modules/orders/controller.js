// Orders 모듈 - 컨트롤러 계층

const service = require('./service');

class OrderController {
  async getOrders(req, res) {
    try {
      const orders = service.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrder(req, res) {
    try {
      const order = service.getOrderById(req.params.id);
      res.json(order);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      const order = await service.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserOrders(req, res) {
    try {
      const orders = service.getUserOrders(req.params.userId);
      res.json(orders);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
