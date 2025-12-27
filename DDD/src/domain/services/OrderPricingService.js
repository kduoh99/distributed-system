// Domain Service (도메인 서비스)
// - 특정 엔티티나 값 객체에 속하지 않는 도메인 로직
// - 여러 엔티티나 값 객체를 조율하는 비즈니스 규칙
// - 상태를 갖지 않음 (Stateless)

const Money = require('../value-objects/Money');

class OrderPricingService {
  // 할인 정책을 적용한 주문 금액 계산
  calculateDiscountedPrice(order, discountPolicy) {
    const totalAmount = order.getTotalAmount();

    // 할인 정책 적용
    const discountAmount = discountPolicy.calculate(totalAmount, order);

    return totalAmount.subtract(discountAmount);
  }

  // 배송비 계산
  calculateShippingFee(order) {
    const totalAmount = order.getTotalAmount();

    // 비즈니스 규칙: 50,000원 이상 무료 배송
    if (totalAmount.amount >= 50000) {
      return new Money(0);
    }

    // 비즈니스 규칙: 30,000원 이상 2,500원
    if (totalAmount.amount >= 30000) {
      return new Money(2500);
    }

    // 기본 배송비: 3,000원
    return new Money(3000);
  }

  // 최종 결제 금액 계산 (주문 금액 + 배송비 - 할인)
  calculateFinalPrice(order, discountPolicy = null) {
    let finalPrice = order.getTotalAmount();

    // 할인 적용
    if (discountPolicy) {
      const discountAmount = discountPolicy.calculate(finalPrice, order);
      finalPrice = finalPrice.subtract(discountAmount);
    }

    // 배송비 추가
    const shippingFee = this.calculateShippingFee(order);
    finalPrice = finalPrice.add(shippingFee);

    return finalPrice;
  }
}

// 할인 정책 인터페이스
class DiscountPolicy {
  calculate(amount, order) {
    throw new Error('구현되지 않음');
  }
}

// 퍼센트 할인 정책
class PercentageDiscountPolicy extends DiscountPolicy {
  constructor(percentage) {
    super();
    this.percentage = percentage;
  }

  calculate(amount) {
    const discountAmount = amount.amount * (this.percentage / 100);
    return new Money(Math.floor(discountAmount), amount.currency);
  }
}

// 금액 할인 정책
class FixedAmountDiscountPolicy extends DiscountPolicy {
  constructor(discountAmount) {
    super();
    this.discountAmount = discountAmount;
  }

  calculate(amount) {
    // 할인 금액이 주문 금액보다 클 수 없음
    if (this.discountAmount.amount > amount.amount) {
      return amount;
    }
    return this.discountAmount;
  }
}

module.exports = {
  OrderPricingService,
  DiscountPolicy,
  PercentageDiscountPolicy,
  FixedAmountDiscountPolicy
};
