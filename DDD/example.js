const Order = require('./src/domain/entities/Order');
const Money = require('./src/domain/value-objects/Money');
const InMemoryOrderRepository = require('./src/infrastructure/repositories/InMemoryOrderRepository');
const OrderApplicationService = require('./src/application/services/OrderApplicationService');

console.log('=== DDD 실습 ===\n');

// 1. Value Object - 불변 객체
console.log('1. Value Object');
const money = new Money(10000);
const doubled = money.multiply(2);
console.log(`10,000원 x 2 = ${doubled.amount}원\n`);

// 2. Entity - 고유 식별자와 도메인 로직
console.log('2. Entity');
const order = new Order({
  id: 'ORDER-001',
  customerId: 'CUST-001',
  customerName: '홍길동',
  productName: '노트북',
  quantity: 2,
  price: new Money(1500000)
});

console.log(`주문 ID: ${order.id}`);
console.log(`상품: ${order.productName}`);
console.log(`총액: ${order.getTotalAmount().amount}원`);
console.log(`상태: ${order.status}\n`);

// 3. 도메인 로직
console.log('3. 도메인 로직');
order.confirm();
console.log(`확정 후: ${order.status}`);

try {
  order.confirm();
  // updateOrderStatus, setStatsToCancelled
} catch (error) {
  console.log(`규칙 검증: ${error.message}\n`);
}

// 4. Repository
console.log('4. Repository');
const repository = new InMemoryOrderRepository();
repository.save(order);
const found = repository.findById('ORDER-001');
console.log(`조회: ${found.id}\n`);

// 5. Application Service
console.log('5. Application Service');
const appService = new OrderApplicationService(repository);

const newOrder = appService.createOrder({
  customerId: 'CUST-002',
  customerName: '김철수',
  productName: '키보드',
  quantity: 3,
  price: 100000
});

console.log(`신규 주문: ${newOrder.id}`);
console.log(`고객: ${newOrder.customerName}`);
console.log(`상품: ${newOrder.productName} x ${newOrder.quantity}`);
console.log(`총액: ${newOrder.totalAmount}원`);
