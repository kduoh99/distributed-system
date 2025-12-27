
class Money {
  constructor(amount, currency = 'KRW') {
    // 유효성 검증
    if (amount < 0) {
      throw new Error('금액은 0 이상이어야 합니다');
    }
    if (!currency) {
      throw new Error('통화는 필수입니다');
    }

    // 불변성을 위해 Object.freeze 사용
    this._amount = amount;
    this._currency = currency;
    Object.freeze(this);
  }

  get amount() {
    return this._amount;
  }

  get currency() {
    return this._currency;
  }

  // 값 객체는 새로운 인스턴스를 반환
  add(other) {
    if (this._currency !== other._currency) {
      throw new Error('통화가 다른 금액은 더할 수 없습니다');
    }
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other) {
    if (this._currency !== other._currency) {
      throw new Error('통화가 다른 금액은 뺄 수 없습니다');
    }
    return new Money(this._amount - other._amount, this._currency);
  }

  multiply(multiplier) {
    return new Money(this._amount * multiplier, this._currency);
  }

  // 값 객체는 값으로 비교
  equals(other) {
    if (!(other instanceof Money)) {
      return false;
    }
    return this._amount === other._amount && this._currency === other._currency;
  }

  toString() {
    return `${this._amount} ${this._currency}`;
  }
}

module.exports = Money;
