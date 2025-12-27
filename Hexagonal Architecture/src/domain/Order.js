
class Order {
  constructor(id, userId, productId, amount, status = 'PENDING') {
    this.id = id;
    this.userId = userId;
    this.productId = productId;
    this.amount = amount;
    this.status = status; // PENDING, PAID, FAILED, CANCELLED
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // 비즈니스 규칙: 주문을 결제 완료 상태로 변경
  markAsPaid() {
    if (this.status !== 'PENDING') {
      throw new Error('대기 중인 주문만 결제할 수 있습니다');
    }
    this.status = 'PAID';
    this.updatedAt = new Date();
  }

  // 비즈니스 규칙: 주문을 실패 상태로 변경
  markAsFailed(reason) {
    if (this.status !== 'PENDING') {
      throw new Error('대기 중인 주문만 실패 처리할 수 있습니다');
    }
    this.status = 'FAILED';
    this.failureReason = reason;
    this.updatedAt = new Date();
  }

  // 비즈니스 규칙: 주문 취소
  cancel() {
    if (this.status === 'PAID') {
      throw new Error('이미 결제된 주문은 취소할 수 없습니다');
    }
    this.status = 'CANCELLED';
    this.updatedAt = new Date();
  }

  // 비즈니스 규칙: 결제 가능 여부 확인
  canBePaid() {
    return this.status === 'PENDING' && this.amount > 0;
  }

  // 비즈니스 규칙: 취소 가능 여부 확인
  canBeCancelled() {
    return this.status !== 'PAID';
  }
}

module.exports = Order;