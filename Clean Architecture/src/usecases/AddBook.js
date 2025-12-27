const Book = require('../domain/entities/Book');

class AddBook {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(bookData) {
    const { title, author, isbn, availableCopies } = bookData;

    // 유효성 검증 (애플리케이션 레벨)
    if (!title || !author || !isbn) {
      throw new Error('책 제목, 저자, ISBN은 필수입니다');
    }

    // ISBN 중복 확인
    const existingBook = await this.bookRepository.findByIsbn(isbn);
    if (existingBook) {
      throw new Error('이미 등록된 ISBN입니다');
    }

    // 도메인 엔티티 생성
    const id = Date.now().toString();
    const book = new Book(id, title, author, isbn, availableCopies || 1);

    // 저장
    await this.bookRepository.save(book);

    return {
      success: true,
      message: '책이 성공적으로 추가되었습니다',
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        availableCopies: book.availableCopies
      }
    };
  }
}

module.exports = AddBook;
