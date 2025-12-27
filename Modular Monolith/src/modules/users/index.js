// Users 모듈의 진입점
// -> 이 모듈의 공개 API정의

const routes = require('./routes');
const service = require('./service');

module.exports = {
  routes,
  // 다른 모듈에서 사용할 수 있는 공개 인터페이스
  getUserInfo: service.getUserInfo.bind(service)
};
