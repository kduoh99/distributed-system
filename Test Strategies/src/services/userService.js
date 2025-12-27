const { isValidEmail } = require('../utils/validator');

// 간단한 in-memory 사용자 DB
const users = new Map([
  ['user1@example.com', { id: 'user1', email: 'user1@example.com', name: 'Alice', vip: true }],
  ['user2@example.com', { id: 'user2', email: 'user2@example.com', name: 'Bob', vip: false }]
]);

class UserService {
  // 사용자 조회
  getUserByEmail(email) {
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    const user = users.get(email);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // 사용자 생성
  createUser(email, name) {
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!name || name.trim().length === 0) {
      throw new Error('Name is required');
    }

    if (users.has(email)) {
      throw new Error('User already exists');
    }

    const user = {
      id: `user${users.size + 1}`,
      email,
      name,
      vip: false
    };

    users.set(email, user);
    return user;
  }

  // VIP 여부 확인
  isVipUser(email) {
    const user = this.getUserByEmail(email);
    return user.vip;
  }
}

module.exports = UserService;
