
const PaymentGateway = require('../../../ports/outbound/PaymentGateway');

class FakePaymentGateway extends PaymentGateway {
  constructor() {
    super();
    this.payments = new Map();
  }

  async processPayment(orderId, amount) {
    // 실제로는 외부 PG사 API를 호출
    // 여기서는 간단한 시뮬레이션

    // 90% 확률로 성공
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      this.payments.set(orderId, {
        orderId,
        amount,
        status: 'COMPLETED',
        timestamp: new Date()
      });

      return {
        success: true,
        transactionId: `TXN-${Date.now()}`,
        message: '결제가 승인되었습니다'
      };
    } else {
      return {
        success: false,
        reason: '카드 승인이 거부되었습니다'
      };
    }
  }

  async refundPayment(orderId) {
    const payment = this.payments.get(orderId);

    if (!payment) {
      throw new Error('결제 내역을 찾을 수 없습니다');
    }

    payment.status = 'REFUNDED';

    return {
      success: true,
      message: '환불이 완료되었습니다'
    };
  }

  async getPaymentStatus(orderId) {
    const payment = this.payments.get(orderId);

    if (!payment) {
      return { status: 'NOT_FOUND' };
    }

    return {
      status: payment.status,
      amount: payment.amount,
      timestamp: payment.timestamp
    };
  }
}

module.exports = FakePaymentGateway;
