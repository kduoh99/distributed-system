// Modular Monolith 메인 애플리케이션
// 모든 모듈을 하나의 애플리케이션으로 통합

const express = require('express');
const usersModule = require('./modules/users');
const productsModule = require('./modules/products');
const ordersModule = require('./modules/orders');

const app = express();
const PORT = 3000;

// 미들웨어
app.use(express.json());

// 각 모듈의 라우터 등록
// 각 모듈은 독립적이지만 같은 프로세스에서 실행됨
app.use('/api/users', usersModule.routes);
app.use('/api/products', productsModule.routes);
app.use('/api/orders', ordersModule.routes);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
