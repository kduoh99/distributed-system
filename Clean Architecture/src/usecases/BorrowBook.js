class BorrowBook {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(bookId) {
    // 1. 책 조회
    const book = await this.bookRepository.findById(bookId);

    if (!book) {
      throw new Error('책을 찾을 수 없습니다');
    }

    // 2. 도메인 로직 실행 (엔티티의 비즈니스 규칙 사용)
    book.borrow();

    // 3. 변경사항 저장
    await this.bookRepository.update(book);

    return {
      success: true,
      message: `"${book.title}" 책을 대출했습니다`,
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        availableCopies: book.availableCopies
      }
    };
  }
}

module.exports = BorrowBook;
