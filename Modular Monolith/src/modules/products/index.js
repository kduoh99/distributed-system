// Products 모듈 - 진입점

const routes = require('./routes');
const service = require('./service');

module.exports = {
  routes,
  // 다른 모듈에서 사용할 수 있는 공개 인터페이스
  checkStock: service.checkStock.bind(service),
  reduceStock: service.reduceStock.bind(service),
  getProductInfo: service.getProductInfo.bind(service)
};
