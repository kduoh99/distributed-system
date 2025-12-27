const OrderService = require('../../src/services/orderService');


describe('OrderService - Unit Tests', () => {
    let orderService;
    let mockUserService;

    beforeEach(() => {
    // UserService를 Mock으로 대체
        mockUserService = {
            getUserByEmail: jest.fn()
        };

        orderService = new OrderService(mockUserService);
    });


    describe('createOrder', () => {
        test('일반 사용자의 주문을 생성할 수 있다', () => {
            // Mock 설정: 일반 사용자 반환
            mockUserService.getUserByEmail.mockReturnValue({
                id: 'user1',
                email: 'test@example.com',
                name: 'Test User',
                vip: false
            });

            const items = [
                { name: 'Product A', price: 100, quantity: 2 },
                { name: 'Product B', price: 50, quantity: 1 }
            ];

            const order = orderService.createOrder('test@example.com', items);

            expect(order).toBeDefined();
            expect(order.userEmail).toBe('test@example.com');
            expect(order.items).toHaveLength(2);
            expect(order.totalPrice).toBe(250); // 100*2 + 50*1
            expect(order.discount).toBe(0);
            expect(order.status).toBe('pending');

            // UserService가 호출되었는지 검증
            expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
        });

    test('VIP 사용자는 10% 할인을 받는다', () => {
      // Mock 설정: VIP 사용자 반환
      mockUserService.getUserByEmail.mockReturnValue({
        id: 'vip1',
        email: 'vip@example.com',
        name: 'VIP User',
        vip: true
      });

      const items = [
        { name: 'Product A', price: 100, quantity: 1 }
      ];

      const order = orderService.createOrder('vip@example.com', items);

      expect(order.discount).toBe(10); // 100 * 0.1
      expect(order.totalPrice).toBe(90); // 100 - 10
    });

    test('아이템이 없으면 주문을 생성할 수 없다', () => {
      expect(() => {
        orderService.createOrder('test@example.com', []);
      }).toThrow('Items are required');
    });

    test('유효하지 않은 가격은 거부된다', () => {
      mockUserService.getUserByEmail.mockReturnValue({
        id: 'user1',
        email: 'test@example.com',
        vip: false
      });

      const items = [
        { name: 'Product', price: -10, quantity: 1 }
      ];

      expect(() => {
        orderService.createOrder('test@example.com', items);
      }).toThrow('Invalid item price');
    });

    test('존재하지 않는 사용자는 주문할 수 없다', () => {
      // Mock 설정: 에러 발생
      mockUserService.getUserByEmail.mockImplementation(() => {
        throw new Error('User not found');
      });

      const items = [
        { name: 'Product', price: 100, quantity: 1 }
      ];

      expect(() => {
        orderService.createOrder('notfound@example.com', items);
      }).toThrow('User not found');
    });
  });

  describe('updateOrderStatus', () => {
    test('주문 상태를 변경할 수 있다', () => {
      mockUserService.getUserByEmail.mockReturnValue({
        id: 'user1',
        email: 'test@example.com',
        vip: false
      });

      // 주문 생성
      const items = [{ name: 'Product', price: 100, quantity: 1 }];
      const order = orderService.createOrder('test@example.com', items);

      // 상태 변경
      const updatedOrder = orderService.updateOrderStatus(order.id, 'confirmed');

      expect(updatedOrder.status).toBe('confirmed');
      expect(updatedOrder.updatedAt).toBeDefined();
    });

    test('유효하지 않은 상태는 거부된다', () => {
      mockUserService.getUserByEmail.mockReturnValue({
        id: 'user1',
        email: 'test@example.com',
        vip: false
      });

      const items = [{ name: 'Product', price: 100, quantity: 1 }];
      const order = orderService.createOrder('test@example.com', items);

      expect(() => {
        orderService.updateOrderStatus(order.id, 'invalid-status');
      }).toThrow('Invalid status');
    });
  });
})