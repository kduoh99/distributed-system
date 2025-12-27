// Repository Implementation (리포지토리 구현)
// - 인프라 계층에서 구현
// - 실제 영속성 기술 사용 (여기서는 메모리)
// - 도메인 인터페이스를 준수

const OrderRepository = require('../../domain/repositories/OrderRepository');

class InMemoryOrderRepository extends OrderRepository {
  constructor() {
    super();
    this.orders = new Map();
    this.currentId = 1;
  }

  // 주문 저장 (생성 또는 업데이트)
  save(order) {
    // 도메인 객체를 그대로 저장 (실제로는 DB 모델로 변환)
    this.orders.set(order.id, order);
    return order;
  }

  // ID로 주문 조회
  findById(orderId) {
    return this.orders.get(orderId) || null;
  }

  // 고객의 모든 주문 조회
  findByCustomerId(customerId) {
    return Array.from(this.orders.values())
      .filter(order => order.customerId === customerId);
  }

  // 모든 주문 조회
  findAll() {
    return Array.from(this.orders.values());
  }

  // 주문 삭제
  delete(orderId) {
    return this.orders.delete(orderId);
  }

  // 다음 주문 ID 생성 (실제로는 UUID 사용 권장)
  nextId() {
    return `ORDER-${this.currentId++}`;
  }

  // 테스트용: 모든 데이터 초기화
  clear() {
    this.orders.clear();
    this.currentId = 1;
  }
}

module.exports = InMemoryOrderRepository;
