const express = require('express');

// Domain (핵심 비즈니스 로직)
// - 외부 의존성 없음

// Ports (인터페이스 정의)
// - Inbound Ports: 애플리케이션으로 들어오는 요청
// - Outbound Ports: 애플리케이션에서 나가는 요청

// Application (Inbound Port 구현)
const OrderServiceImpl = require('./application/OrderServiceImpl');

// Outbound Adapters (Outbound Ports 구현)
const InMemoryOrderRepository = require('./adapters/outbound/database/InMemoryOrderRepository');
const FakePaymentGateway = require('./adapters/outbound/payment/FakePaymentGateway');

// Inbound Adapters (외부에서 들어오는 요청 처리)
const OrderController = require('./adapters/inbound/http/OrderController');
const createRouter = require('./adapters/inbound/http/routes');

function createApp() {
    const app = express();
    app.use(express.json());

    // 1. Outbound Adapters 생성 (외부 시스템 구현체)
    const orderRepository = new InMemoryOrderRepository();
    const paymentGateway = new FakePaymentGateway();

    // 2. Application Core 생성 (Hexagon의 중심)
    // Outbound Ports를 주입받음
    const orderService = new OrderServiceImpl(orderRepository, paymentGateway);

    // 3. Inbound Adapter 생성 (외부 요청 처리)
    //    Inbound Port를 주입받음
    const orderController = new OrderController(orderService);

    const orderRouter = createRouter(orderController);

    app.use('/api/orders', orderRouter);

    return app;
}

const PORT = 3002;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
