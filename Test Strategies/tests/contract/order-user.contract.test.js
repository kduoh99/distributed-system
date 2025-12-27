/*
{
  id: 'user1',
  email: 'user1@example.com',
  name: 'Alice',
  vip: true
}

const user = await userService.getUserByEmail(email);
if (user.vip) {  // vip 필드 사용!
  discount = totalPrice * 0.1;
}

{
  id: 'user1',
  email: 'user1@example.com',
  name: 'Alice',
  isPremium: true  // vip → isPremium 변경!
}
*/

const { Pact } = require('@pact-foundation/pact');
const path = require('path');


describe('OrderService → UserService Contract', () => {
  // Pact Mock Provider 설정
  const provider = new Pact({
    consumer: 'OrderService',
    provider: 'UserService',
    port: 8989,
    log: path.resolve(process.cwd(), 'tests/contract/logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'tests/contract/pacts'),
    logLevel: 'warn'
  });

  // 모든 테스트 전에 Mock Provider 시작
  beforeAll(() => provider.setup());

  // 각 테스트 후 검증
  afterEach(() => provider.verify());

  // 모든 테스트 후 종료
  afterAll(() => provider.finalize());

  describe('getUserByEmail API', () => {
    test('VIP 사용자 정보를 정확하게 반환한다', async () => {
      // Consumer가 기대하는 계약 정의
      await provider.addInteraction({
        state: 'user1@example.com exists and is VIP',
        uponReceiving: 'a request for user1@example.com',
        withRequest: {
          method: 'GET',
          path: '/api/users/user1@example.com'
        //   query : {}
        // headers : {'Auth' : ''}
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            id: 'user1',
            email: 'user1@example.com',
            name: 'Alice',
            vip: true
          }
        }
      });

      // 실제 OrderService가 이 API를 호출하는 시나리오
      // (간소화를 위해 fetch 직접 사용)
      const response = await fetch('http://localhost:8989/api/users/user1@example.com');
      const user = await response.json();

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('vip');
      expect(user.vip).toBe(true);
    });

    test('일반 사용자 정보를 정확하게 반환한다', async () => {
      await provider.addInteraction({
        state: 'user2@example.com exists and is not VIP',
        uponReceiving: 'a request for user2@example.com',
        withRequest: {
          method: 'GET',
          path: '/api/users/user2@example.com'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            id: 'user2',
            email: 'user2@example.com',
            name: 'Bob',
            vip: false
          }
        }
      });

      const response = await fetch('http://localhost:8989/api/users/user2@example.com');
      const user = await response.json();

      expect(user.vip).toBe(false);
    });

    test('존재하지 않는 사용자는 404 에러를 반환한다', async () => {
      await provider.addInteraction({
        state: 'nonexistent@example.com does not exist',
        uponReceiving: 'a request for nonexistent user',
        withRequest: {
          method: 'GET',
          path: '/api/users/nonexistent@example.com'
        },
        willRespondWith: {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            error: 'User not found'
          }
        }
      });

      const response = await fetch('http://localhost:8989/api/users/nonexistent@example.com');

      expect(response.status).toBe(404);
      const error = await response.json();
      expect(error).toHaveProperty('error');
    });
  });
});