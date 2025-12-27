
const OrderService = require('../ports/inbound/OrderService');
const Order = require('../domain/Order');

class OrderServiceImpl extends OrderService {
  constructor(orderRepository, paymentGateway) {
    super();
    this.orderRepository = orderRepository; // Outbound Port
    this.paymentGateway = paymentGateway;   // Outbound Port
  }

  async createOrder(userId, productId, amount) {
    // 입력 검증
    if (!userId || !productId || !amount || amount <= 0) {
      throw new Error('유효하지 않은 주문 정보입니다');
    }

    // 도메인 엔티티 생성
    const orderId = Date.now().toString();
    const order = new Order(orderId, userId, productId, amount);

    // Outbound Port를 통해 저장
    await this.orderRepository.save(order);

    return {
      success: true,
      message: '주문이 생성되었습니다',
      order: {
        id: order.id,
        userId: order.userId,
        productId: order.productId,
        amount: order.amount,
        status: order.status
      }
    };
  }

  async getOrder(orderId) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('주문을 찾을 수 없습니다');
    }

    return order;
  }

  async getAllOrders() {
    const orders = await this.orderRepository.findAll();
    return orders;
  }

  async processPayment(orderId) {
    // 1. 주문 조회
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('주문을 찾을 수 없습니다');
    }

    // 2. 도메인 규칙 검증
    if (!order.canBePaid()) {
      throw new Error('결제할 수 없는 주문입니다');
    }

    try {
      // 3. Outbound Port를 통해 결제 처리
      const paymentResult = await this.paymentGateway.processPayment(
        order.id,
        order.amount
      );

      if (paymentResult.success) {
        // 4. 도메인 엔티티 상태 변경
        order.markAsPaid();

        // 5. 변경사항 저장
        await this.orderRepository.update(order);

        return {
          success: true,
          message: '결제가 완료되었습니다',
          order: {
            id: order.id,
            status: order.status,
            amount: order.amount
          }
        };
      } else {
        order.markAsFailed(paymentResult.reason);
        await this.orderRepository.update(order);

        throw new Error(`결제 실패: ${paymentResult.reason}`);
      }
    } catch (error) {
      // 결제 실패 처리
      order.markAsFailed(error.message);
      await this.orderRepository.update(order);

      throw error;
    }
  }

  async cancelOrder(orderId) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('주문을 찾을 수 없습니다');
    }

    // 도메인 규칙 적용
    order.cancel();

    // 변경사항 저장
    await this.orderRepository.update(order);

    return {
      success: true,
      message: '주문이 취소되었습니다',
      order: {
        id: order.id,
        status: order.status
      }
    };
  }
}

module.exports = OrderServiceImpl;
