const UserService = require('../../src/services/userService');


describe('UserService - Unit Tests', () => {
    let userService;

    beforeEach(() => {
        userService = new UserService();
    });


  describe('getUserByEmail', () => {
    test('존재하는 사용자를 조회할 수 있다', () => {
      const user = userService.getUserByEmail('user1@example.com');

      expect(user).toBeDefined();
      expect(user.email).toBe('user1@example.com');
      expect(user.name).toBe('Alice');
    });

    test('존재하지 않는 사용자 조회 시 에러를 던진다', () => {
      expect(() => {
        userService.getUserByEmail('notfound@example.com');
      }).toThrow('User not found');
    });

    test('유효하지 않은 이메일 형식은 에러를 던진다', () => {
      expect(() => {
        userService.getUserByEmail('invalid-email');
      }).toThrow('Invalid email format');
    });
  });

  describe('createUser', () => {
    test('새로운 사용자를 생성할 수 있다', () => {
      const user = userService.createUser('newuser@example.com', 'Charlie');

      expect(user).toBeDefined();
      expect(user.email).toBe('newuser@example.com');
      expect(user.name).toBe('Charlie');
      expect(user.vip).toBe(false);
    });

    test('이미 존재하는 이메일로는 생성할 수 없다', () => {
      expect(() => {
        userService.createUser('user1@example.com', 'Duplicate');
      }).toThrow('User already exists');
    });

    test('유효하지 않은 이메일은 거부된다', () => {
      expect(() => {
        userService.createUser('invalid-email', 'Test');
      }).toThrow('Invalid email format');
    });

    test('이름이 없으면 생성할 수 없다', () => {
      expect(() => {
        userService.createUser('test@example.com', '');
      }).toThrow('Name is required');
    });
  });

  describe('isVipUser', () => {
    test('VIP 사용자를 확인할 수 있다', () => {
      expect(userService.isVipUser('user1@example.com')).toBe(true);
    });

    test('일반 사용자를 확인할 수 있다', () => {
      expect(userService.isVipUser('user2@example.com')).toBe(false);
    });
  });
})