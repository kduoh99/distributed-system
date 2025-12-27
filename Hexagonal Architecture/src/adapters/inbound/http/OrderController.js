

class OrderController {
  constructor(orderService) {
    this.orderService = orderService; // Inbound Port
  }

  async createOrder(req, res) {
    try {
      const { userId, productId, amount } = req.body;
      const result = await this.orderService.createOrder(userId, productId, amount);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrder(id);
      res.json({
        success: true,
        order
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json({
        success: true,
        orders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async processPayment(req, res) {
    try {
      const { id } = req.params;
      const result = await this.orderService.processPayment(id);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const result = await this.orderService.cancelOrder(id);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = OrderController;
