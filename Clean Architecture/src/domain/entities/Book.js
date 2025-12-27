

class Book {
    constructor(id, title, author, isbn, availableCopies = 1) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.availableCopies = availableCopies;
    }

    canBorrow() {
        return this.availableCopies > 0;
    }

    borrow() {
        if (!this.canBorrow()) {
            throw new Error('대출 가능한 책이 없습니다');
        }
        this.availableCopies -= 1;
    }

}

module.exports = Book;