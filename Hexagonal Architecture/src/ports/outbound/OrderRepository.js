// Outbound Port (Secondary Port)
// 애플리케이션에서 외부 시스템(DB)으로 나가는 인터페이스
// 데이터 저장소에 대한 추상화

class OrderRepository {
  async save(order) {
    throw new Error('save() must be implemented');
  }

  async findById(orderId) {
    throw new Error('findById() must be implemented');
  }

  async findAll() {
    throw new Error('findAll() must be implemented');
  }

  async update(order) {
    throw new Error('update() must be implemented');
  }

  async delete(orderId) {
    throw new Error('delete() must be implemented');
  }
}

module.exports = OrderRepository;
