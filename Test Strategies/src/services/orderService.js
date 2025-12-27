const { isValidPrice, generateOrderId } = require('../utils/validator');
const UserService = require('./userService');

// 간단한 in-memory 주문 DB
const orders = new Map();

class OrderService {
  constructor(userService = new UserService()) {
    this.userService = userService;
  }

  // 주문 생성
  createOrder(userEmail, items) {
    // 입력 검증
    if (!items || items.length === 0) {
      throw new Error('Items are required');
    }

    // 사용자 존재 여부 확인 (User Service 호출)
    const user = this.userService.getUserByEmail(userEmail);

    // 총 금액 계산
    let totalPrice = 0;
    for (const item of items) {
      if (!isValidPrice(item.price)) {
        throw new Error('Invalid item price');
      }
      if (!item.quantity || item.quantity < 1) {
        throw new Error('Invalid item quantity');
      }
      totalPrice += item.price * item.quantity;
    }

    // VIP 사용자는 10% 할인
    let discount = 0;
    if (user.vip) {
      discount = totalPrice * 0.1;
      totalPrice -= discount;
    }

    // 주문 생성
    const order = {
      id: generateOrderId(),
      userId: user.id,
      userEmail: user.email,
      items,
      totalPrice,
      discount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.set(order.id, order);
    return order;
  }

  // 주문 조회
  getOrder(orderId) {
    const order = orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  // 주문 상태 변경
  updateOrderStatus(orderId, status) {
    const order = this.getOrder(orderId);

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    return order;
  }

  // 사용자의 모든 주문 조회
  getUserOrders(userEmail) {
    const userOrders = Array.from(orders.values())
      .filter(order => order.userEmail === userEmail);
    return userOrders;
  }
}

module.exports = OrderService;
