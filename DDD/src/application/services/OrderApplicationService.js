```
외부 (UI/API)
    ↓ DTO
Application Service (조율)
    ↓ Domain Object
Domain Service (비즈니스 로직)
Entity / Value Object (비즈니스 로직)
    ↓ Interface
Repository (영속성 추상화)
    ↓ Implementation
Infrastructure (DB, 외부 API)
```

// Application Service (애플리케이션 서비스)
// - 유스케이스를 조율
// - 도메인 객체를 사용하여 비즈니스 로직 실행
// - DTO와 도메인 객체 간 변환

const Order = require('../../domain/entities/Order');
const Money = require('../../domain/value-objects/Money');

class OrderApplicationService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  // 유스케이스: 주문 생성
  createOrder(createOrderDto) {
    const { customerId, customerName, productName, quantity, price } = createOrderDto;

    const order = new Order({
      id: this.orderRepository.nextId(),
      customerId,
      customerName,
      productName,
      quantity,
      price: new Money(price)
    });

    const savedOrder = this.orderRepository.save(order);
    return this.toOrderDto(savedOrder);
  }

  // 도메인 객체를 DTO로 변환
  toOrderDto(order) {
    return {
      id: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      productName: order.productName,
      quantity: order.quantity,
      price: order.price.amount,
      totalAmount: order.getTotalAmount().amount,
      status: order.status
    };
  }
}

module.exports = OrderApplicationService;
