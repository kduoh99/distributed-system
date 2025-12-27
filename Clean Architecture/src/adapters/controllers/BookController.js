


class BookController {
  constructor(addBook, borrowBook) {
    this.addBook = addBook;
    this.borrowBook = borrowBook;
  }

  async create(req, res) {
    try {
      const result = await this.addBook.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async borrow(req, res) {
    try {
      const { id } = req.params;
      const result = await this.borrowBook.execute(id);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = BookController;
