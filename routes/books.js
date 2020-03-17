const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

/* GET book listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("book/index", {
    books: books,
    title: "Books"
  });
}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("book/new_book", {
    title: "Create New Book"
  });
});

/* POST create book. */
router.post('/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.redirect("/books/" + book.id);
}));


/* GET individual book */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id)
  res.render("book/book_detail", {
    book: book,
    title: book.title
  });
}));

/* Update a book. */
router.post('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body)
  res.redirect("/books/" + book.id);
}));


/* Delete book. */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect("/books");
}));

module.exports = router;