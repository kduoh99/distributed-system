const express = require('express');

function createRouter(bookController) {
  const router = express.Router();
  
  // 새 책 추가
  router.post('/', (req, res) => bookController.create(req, res));

  // 책 대출
  router.post('/:id/borrow', (req, res) => bookController.borrow(req, res));

  return router;
}

module.exports = createRouter;