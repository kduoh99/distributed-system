const request = require('supertest');
const app = require('../../src/api/orderApi');


describe('Checkout API - E2E Tests', () => {
  let createdOrderId;

  test('전체 체크아웃 시나리오: 주문 생성 → 조회 → 상태 변경', async () => {
    // 1. Health check
    const healthResponse = await request(app).get('/health');
    expect(healthResponse.status).toBe(200);
    expect(healthResponse.body.status).toBe('healthy');

    // 2. 주문 생성 (VIP 사용자)
    const createResponse = await request(app)
      .post('/api/orders')
      .send({
        userEmail: 'user1@example.com',
        items: [
          { name: 'Laptop', price: 1000, quantity: 1 },
          { name: 'Mouse', price: 50, quantity: 2 }
        ]
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.totalPrice).toBe(990); // VIP 10% 할인: (1000 + 100) * 0.9
    expect(createResponse.body.status).toBe('pending');

    createdOrderId = createResponse.body.id;

    // 3. 주문 조회
    const getResponse = await request(app).get(`/api/orders/${createdOrderId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.id).toBe(createdOrderId);
    expect(getResponse.body.userEmail).toBe('user1@example.com');

    // 4. 주문 확인 (상태 변경: pending → confirmed)
    const confirmResponse = await request(app)
      .patch(`/api/orders/${createdOrderId}/status`)
      .send({ status: 'confirmed' });

    expect(confirmResponse.status).toBe(200);
    expect(confirmResponse.body.status).toBe('confirmed');

    // 5. 배송 (상태 변경: confirmed → shipped)
    const shipResponse = await request(app)
      .patch(`/api/orders/${createdOrderId}/status`)
      .send({ status: 'shipped' });

    expect(shipResponse.status).toBe(200);
    expect(shipResponse.body.status).toBe('shipped');

    // 6. 최종 주문 조회로 상태 확인
    const finalResponse = await request(app).get(`/api/orders/${createdOrderId}`);

    expect(finalResponse.status).toBe(200);
    expect(finalResponse.body.status).toBe('shipped');
  });

  test('일반 사용자 주문: 할인이 적용되지 않는다', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        userEmail: 'user2@example.com', // 일반 사용자
        items: [
          { name: 'Product', price: 1000, quantity: 1 }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.discount).toBe(0);
    expect(response.body.totalPrice).toBe(1000);
  });

  test('잘못된 요청: 아이템이 없는 경우', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        userEmail: 'user1@example.com',
        items: []
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Items are required');
  });

  test('잘못된 요청: 존재하지 않는 사용자', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        userEmail: 'nonexistent@example.com',
        items: [
          { name: 'Product', price: 100, quantity: 1 }
        ]
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('User not found');
  });

  test('잘못된 요청: 존재하지 않는 주문 조회', async () => {
    const response = await request(app).get('/api/orders/invalid-order-id');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Order not found');
  });

  test('잘못된 요청: 유효하지 않은 상태로 변경', async () => {
    // 먼저 주문 생성
    const createResponse = await request(app)
      .post('/api/orders')
      .send({
        userEmail: 'user1@example.com',
        items: [{ name: 'Product', price: 100, quantity: 1 }]
      });

    const orderId = createResponse.body.id;

    // 유효하지 않은 상태로 변경 시도
    const response = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .send({ status: 'invalid-status' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid status');
  });
});