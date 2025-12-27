// Orders 모듈 - 비즈니스 로직 계층
// 주목: 다른 모듈의 공개 인터페이스를 사용하는 모듈 간 통신

const repository = require('./repository');
const usersModule = require('../users');
const productsModule = require('../products');

class OrderService {
  getAllOrders() {
    return repository.findAll();
  }

  getOrderById(id) {
    const order = repository.findById(id);
    if (!order) {
      throw new Error('주문을 찾을 수 없습니다');
    }
    return order;
  }

  async createOrder(orderData) {
    const { userId, productId, quantity } = orderData;

    // 모듈 간 통신: Users 모듈에서 사용자 정보 가져오기
    const user = usersModule.getUserInfo(userId);

    // 모듈 간 통신: Products 모듈에서 상품 정보 가져오기
    const product = productsModule.getProductInfo(productId);

    // 모듈 간 통신: 재고 확인
    if (!productsModule.checkStock(productId, quantity)) {
      throw new Error('재고가 부족합니다');
    }

    // 주문 생성
    const totalPrice = product.price * quantity;
    const order = repository.create({
      userId: user.id,
      userName: user.name,
      productId: product.id,
      productName: product.name,
      quantity,
      totalPrice
    });

    // 모듈 간 통신: 재고 감소
    productsModule.reduceStock(productId, quantity);

    return order;
  }

  getUserOrders(userId) {
    // 사용자 존재 여부 확인
    usersModule.getUserInfo(userId);
    return repository.findByUserId(userId);
  }
}

module.exports = new OrderService();
