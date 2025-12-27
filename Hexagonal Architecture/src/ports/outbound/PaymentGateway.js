// Outbound Port (Secondary Port)
// 애플리케이션에서 외부 결제 시스템으로 나가는 인터페이스
// 결제 처리에 대한 추상화

class PaymentGateway {
  async processPayment(orderId, amount) {
    throw new Error('processPayment() must be implemented');
  }

  async refundPayment(orderId) {
    throw new Error('refundPayment() must be implemented');
  }

  async getPaymentStatus(orderId) {
    throw new Error('getPaymentStatus() must be implemented');
  }
}

module.exports = PaymentGateway;
