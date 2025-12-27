// Inbound Port (Primary Port)
// 애플리케이션의 코어 기능을 정의하는 인터페이스
// 외부에서 애플리케이션으로 들어오는 요청을 처리

class OrderService {
  async createOrder(userId, productId, amount) {
    throw new Error('createOrder() must be implemented');
  }

  async getOrder(orderId) {
    throw new Error('getOrder() must be implemented');
  }

  async getAllOrders() {
    throw new Error('getAllOrders() must be implemented');
  }

  async processPayment(orderId) {
    throw new Error('processPayment() must be implemented');
  }

  async cancelOrder(orderId) {
    throw new Error('cancelOrder() must be implemented');
  }
}

module.exports = OrderService;
