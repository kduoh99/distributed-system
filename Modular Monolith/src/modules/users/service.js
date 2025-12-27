// Users 모듈의 비지니스 로직 계층
// 핵심적인 비지니스 로직을 처리

const repository = require('./repository');

class UserService {
  getAllUsers() {
    return repository.findAll();
  }

  getUserById(id) {
    const user = repository.findById(id);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다');
    }
    return user;
  }

  createUser(userData) {
    // 간단한 유효성 검사
    if (!userData.name || !userData.email) {
      throw new Error('이름과 이메일은 필수입니다');
    }
    return repository.create(userData);
  }

  // 다른 모듈에서 사용할 수 있는 공개 인터페이스
  getUserInfo(userId) {
    return this.getUserById(userId);
  }
}

module.exports = new UserService();
