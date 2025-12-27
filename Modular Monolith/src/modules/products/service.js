// Products 모듈 - 비즈니스 로직 계층

const repository = require('./repository');

class ProductService {
  getAllProducts() {
    return repository.findAll();
  }

  getProductById(id) {
    const product = repository.findById(id);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다');
    }
    return product;
  }

  createProduct(productData) {
    if (!productData.name || !productData.price) {
      throw new Error('상품명과 가격은 필수입니다');
    }
    return repository.create(productData);
  }

  // 다른 모듈에서 사용할 수 있는 공개 인터페이스
  checkStock(productId, quantity) {
    const product = this.getProductById(productId);
    return product.stock >= quantity;
  }

  reduceStock(productId, quantity) {
    const product = this.getProductById(productId);
    if (product.stock < quantity) {
      throw new Error('재고가 부족합니다');
    }
    return repository.updateStock(productId, quantity);
  }

  getProductInfo(productId) {
    return this.getProductById(productId);
  }
}

module.exports = new ProductService();
