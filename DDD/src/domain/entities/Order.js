
const Money = require('../value-objects/Money');

class Order {
  static Status = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED'
  };

  constructor({ id, customerId, customerName, productName, quantity, price, status = Order.Status.PENDING }) {
    if (!id) {
      throw new Error('주문 ID는 필수입니다');
    }
    if (!customerId) {
      throw new Error('고객 ID는 필수입니다');
    }
    if (!productName) {
      throw new Error('상품명은 필수입니다');
    }
    if (quantity <= 0) {
      throw new Error('수량은 1 이상이어야 합니다');
    }
    if (!(price instanceof Money)) {
      throw new Error('가격은 Money 객체여야 합니다');
    }

    this._id = id;
    this._customerId = customerId;
    this._customerName = customerName;
    this._productName = productName;
    this._quantity = quantity;
    this._price = price;
    this._status = status;
  }

  get id() {
    return this._id;
  }

  get customerId() {
    return this._customerId;
  }

  get customerName() {
    return this._customerName;
  }

  get productName() {
    return this._productName;
  }

  get quantity() {
    return this._quantity;
  }

  get price() {
    return this._price;
  }

  get status() {
    return this._status;
  }

  // 도메인 로직: 총 금액 계산
  getTotalAmount() {
    return this._price.multiply(this._quantity);
  }

  // 도메인 로직: 주문 확정
  confirm() {
    if (this._status !== Order.Status.PENDING) {
      throw new Error('대기 중인 주문만 확정할 수 있습니다');
    }
    this._status = Order.Status.CONFIRMED;
  }

  // 엔티티는 식별자로 비교
  equals(other) {
    if (!(other instanceof Order)) {
      return false;
    }
    return this._id === other._id;
  }
}

module.exports = Order;
