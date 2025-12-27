// Users 모듈 -> 데이터 저장소 계층
// 데이터베이스 접근을 담당

class UserRepository {
  constructor() {
    this.users = [
      { id: 1, name: '김철수', email: 'kim@example.com' },
      { id: 2, name: '이영희', email: 'lee@example.com' }
    ];
    this.nextId = 3;
  }

  findAll() {
    return this.users;
  }

  findById(id) {
    return this.users.find(user => user.id === parseInt(id));
  }

  create(userData) {
    const newUser = {
      id: this.nextId++,
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }
}

module.exports = new UserRepository();
