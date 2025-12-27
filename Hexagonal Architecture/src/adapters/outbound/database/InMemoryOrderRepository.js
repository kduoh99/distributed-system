
const OrderRepository = require('../../../ports/outbound/OrderRepository');

class InMemoryOrderRepository extends OrderRepository {
  constructor() {
    super();
    this.orders = new Map();
  }

  async save(order) {
    this.orders.set(order.id, order);
    return order;
  }

  async findById(orderId) {
    return this.orders.get(orderId) || null;
  }

  async findAll() {
    return Array.from(this.orders.values());
  }

  async update(order) {
    if (!this.orders.has(order.id)) {
      throw new Error('주문을 찾을 수 없습니다');
    }
    this.orders.set(order.id, order);
    return order;
  }

  async delete(orderId) {
    return this.orders.delete(orderId);
  }
}

module.exports = InMemoryOrderRepository;
