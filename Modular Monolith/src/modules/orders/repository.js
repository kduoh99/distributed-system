// Orders 모듈 - 데이터 저장소 계층

class OrderRepository {
  constructor() {
    this.orders = [];
    this.nextId = 1;
  }

  findAll() {
    return this.orders;
  }

  findById(id) {
    return this.orders.find(order => order.id === parseInt(id));
  }

  findByUserId(userId) {
    return this.orders.filter(order => order.userId === parseInt(userId));
  }

  create(orderData) {
    const newOrder = {
      id: this.nextId++,
      ...orderData,
      createdAt: new Date().toISOString()
    };
    this.orders.push(newOrder);
    return newOrder;
  }
}

module.exports = new OrderRepository();
