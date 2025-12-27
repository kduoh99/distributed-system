
const BookRepository = require('../../domain/repositories/BookRepository');
const Book = require('../../domain/entities/Book');

class InMemoryBookRepository extends BookRepository {
  constructor() {
    super();
    this.books = new Map();
    this.initializeData();
  }

  // 초기 데이터 설정
  initializeData() {
    const initialBooks = [
      new Book('1', '클린 아키텍처', 'Robert C. Martin', '978-0134494166', 3),
      new Book('2', '도메인 주도 설계', 'Eric Evans', '978-0321125217', 2),
      new Book('3', 'Refactoring', 'Martin Fowler', '978-0134757599', 1)
    ];

    initialBooks.forEach(book => {
      this.books.set(book.id, book);
    });
  }
  
  async save(book) {
    this.books.set(book.id, book);
    return book;
  }

  async update(book) {
    if (!this.books.has(book.id)) {
      throw new Error('책을 찾을 수 없습니다');
    }
    this.books.set(book.id, book);
    return book;
  }

  async delete(id) {
    return this.books.delete(id);
  }
}

module.exports = InMemoryBookRepository;