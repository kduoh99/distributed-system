
// Domain Layer -> Data acess Layer (의존)

// Domain Layer (인터페이스 정의)
//      ↑
// Infrasture Layer (인터페이스 구현)

// Repository Interface (리포지토리 인터페이스)
// - 도메인 계층에서 정의하는 인터페이스
// - 영속성 기술에 독립적
// - 도메인 객체를 저장하고 조회하는 추상화

class OrderRepository {
  // 주문 저장
  save(order) {
    throw new Error('구현되지 않음');
  }

  // ID로 주문 조회
  findById(orderId) {
    throw new Error('구현되지 않음');
  }

  // 고객의 모든 주문 조회
  findByCustomerId(customerId) {
    throw new Error('구현되지 않음');
  }

  // 모든 주문 조회
  findAll() {
    throw new Error('구현되지 않음');
  }

  // 주문 삭제
  delete(orderId) {
    throw new Error('구현되지 않음');
  }

  // 다음 주문 ID 생성
  nextId() {
    throw new Error('구현되지 않음');
  }
}

module.exports = OrderRepository;
