// Products 모듈 - 데이터 저장소 계층

class ProductRepository {
  constructor() {
    this.products = [
      { id: 1, name: '노트북', price: 1500000, stock: 10 },
      { id: 2, name: '마우스', price: 30000, stock: 50 },
      { id: 3, name: '키보드', price: 80000, stock: 30 }
    ];
    this.nextId = 4;
  }

  findAll() {
    return this.products;
  }

  findById(id) {
    return this.products.find(product => product.id === parseInt(id));
  }

  create(productData) {
    const newProduct = {
      id: this.nextId++,
      ...productData
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateStock(id, quantity) {
    const product = this.findById(id);
    if (product) {
      product.stock -= quantity;
      return product;
    }
    return null;
  }
}

module.exports = new ProductRepository();
