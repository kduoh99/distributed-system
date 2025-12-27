const UserService = require('../../src/services/userService');
const OrderService = require('../../src/services/orderService');

describe('Order Flow - Integration Tests', () => {
  let userService;
  let orderService;

  beforeEach(() => {
    // 실제 서비스들을 사용 (Mock 없이)
    userService = new UserService();
    orderService = new OrderService(userService);
  });

  test('전체 주문 플로우: 사용자 생성 → 주문 생성 → 상태 변경', () => {
    // 1. 사용자 생성
    const user = userService.createUser('integration@example.com', 'Integration Test User');
    expect(user).toBeDefined();
    expect(user.email).toBe('integration@example.com');

    // 2. 주문 생성
    const items = [
      { name: 'Laptop', price: 1000, quantity: 1 },
      { name: 'Mouse', price: 50, quantity: 2 }
    ];

    const order = orderService.createOrder('integration@example.com', items);
    expect(order).toBeDefined();
    expect(order.userId).toBe(user.id);
    expect(order.totalPrice).toBe(1100);
    expect(order.status).toBe('pending');

    // 3. 주문 상태 변경: pending → confirmed
    const confirmedOrder = orderService.updateOrderStatus(order.id, 'confirmed');
    expect(confirmedOrder.status).toBe('confirmed');

    // 4. 주문 상태 변경: confirmed → shipped
    const shippedOrder = orderService.updateOrderStatus(order.id, 'shipped');
    expect(shippedOrder.status).toBe('shipped');

    // 5. 주문 조회
    const fetchedOrder = orderService.getOrder(order.id);
    expect(fetchedOrder.status).toBe('shipped');
  });

  test('VIP 사용자의 주문 플로우: VIP 할인이 적용된다', () => {
    // VIP 사용자로 주문
    const items = [
      { name: 'Premium Product', price: 1000, quantity: 1 }
    ];

    const order = orderService.createOrder('user1@example.com', items); // VIP 사용자

    expect(order.discount).toBe(100); // 10% 할인
    expect(order.totalPrice).toBe(900); // 1000 - 100
  });

  test('일반 사용자의 주문 플로우: 할인이 없다', () => {
    const items = [
      { name: 'Regular Product', price: 1000, quantity: 1 }
    ];

    const order = orderService.createOrder('user2@example.com', items); // 일반 사용자

    expect(order.discount).toBe(0);
    expect(order.totalPrice).toBe(1000);
  });

  test('여러 주문을 생성하고 사용자별로 조회할 수 있다', () => {
    const userEmail = 'user1@example.com';

    // 첫 번째 주문
    const order1 = orderService.createOrder(userEmail, [
      { name: 'Product A', price: 100, quantity: 1 }
    ]);

    // 두 번째 주문
    const order2 = orderService.createOrder(userEmail, [
      { name: 'Product B', price: 200, quantity: 1 }
    ]);

    // 사용자의 모든 주문 조회
    const userOrders = orderService.getUserOrders(userEmail);

    expect(userOrders.length).toBeGreaterThanOrEqual(2);
    expect(userOrders.some(o => o.id === order1.id)).toBe(true);
    expect(userOrders.some(o => o.id === order2.id)).toBe(true);
  });

  test('존재하지 않는 사용자로 주문 시 실패한다', () => {
    const items = [
      { name: 'Product', price: 100, quantity: 1 }
    ];

    expect(() => {
      orderService.createOrder('nonexistent@example.com', items);
    }).toThrow('User not found');
  });

  test('잘못된 상태 전환은 실패한다', () => {
    const order = orderService.createOrder('user1@example.com', [
      { name: 'Product', price: 100, quantity: 1 }
    ]);

    expect(() => {
      orderService.updateOrderStatus(order.id, 'invalid-status');
    }).toThrow('Invalid status');
  });
})