const express = require("express")

// Infrastructure Layer
const InMemoryBookRepository = require('./infrastructure/database/InMemoryBookRepository');
const createRouter = require('./infrastructure/web/routes');

// Use Cases Layer
const AddBook = require('./usecases/AddBook');
const BorrowBook = require('./usecases/BorrowBook');

// Adapters Layer
const BookController = require('./adapters/controllers/BookController');

function createApp() {
    const app = express();
    app.use(express.json());

    const bookRepository = new InMemoryBookRepository();

    const addBook = new AddBook(bookRepository);
    const borrowBook = new BorrowBook(bookRepository);

    const bookController = new BookController(
        addBook,
        borrowBook
    );

    const bookRouter = createRouter(bookController);

    app.use('/api/books', bookRouter);

    return app;
}

const PORT = 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
