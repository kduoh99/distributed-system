class BookRepository {
  async findAll() {
    throw new Error('findAll() must be implemented');
  }

  async findById(id) {
    throw new Error('findById() must be implemented');
  }

  async findByIsbn(isbn) {
    throw new Error('findByIsbn() must be implemented');
  }

  async save(book) {
    throw new Error('save() must be implemented');
  }

  async update(book) {
    throw new Error('update() must be implemented');
  }

  async delete(id) {
    throw new Error('delete() must be implemented');
  }
}

module.exports = BookRepository;