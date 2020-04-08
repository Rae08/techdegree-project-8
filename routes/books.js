const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const {
  Op
} = require("sequelize");

// pagination function
const paginate = (list, page) => {
  const resultsPerPage = 7;
  const pages = Math.ceil(list.length / resultsPerPage);
  const startIndex = (page - 1) * resultsPerPage;
  const lastIndex = page * resultsPerPage;
  let results = [];

  list.forEach((book, index) => {
    if (index >= startIndex && index < lastIndex) {
      results.push(book);
    }
  });

  const pageArray = [];
  for (i = 1; i <= pages; i++) {
    pageArray.push(i.toString());
  };

  const returnArray = [results, pageArray, pages];

  return returnArray;
}

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

/* GET book listing. */

// redirects to paginated books page
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books/results/1')

}));

// paginates book results
router.get('/results/:page', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  if (books) {
    const results = paginate(books, req.params.page);

    if (req.params.page <= results[2]) {
      res.render("book/index", {
        books: results[0],
        title: "Books",
        numOfPages: results[1],
        isSearch: false,
        currentPage: req.params.page
      });

    } else {
      throw error;
    }

  } else {
    throw error;
  }

}));


/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("book/new_book", {
    title: "Create New Book",
  });
});

/* POST create book. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("book/new_book", {
        book: book,
        errors: error.errors,
        title: "Create New Book"
      })
    } else {
      throw error;
    }
  }
}));


/* GET search */
router.get("/search/:search", asyncHandler(async (req, res) => {
  const search = req.params.search
  const results = await Book.findAll({
    where: {
      [Op.or]: {
        title: {
          [Op.like]: `%${search}%`
        },
        author: {
          [Op.like]: `%${search}%`
        },
        genre: {
          [Op.like]: `%${search}%`
        },
        year: {
          [Op.like]: `%${search}%`
        },
      }
    }
  })

  if (results.length >= 1) {
    res.render("book/index", {
      books: results,
      title: "Search Results",
      isSearch: true
    });
  } else {
    throw new Error("No results Found");
  }
}))

/* POST search */
router.post("/search/", asyncHandler(async (req, res) => {
  const search = req.body.search
  res.redirect(`/books/search/${search}`)
}))

/* GET individual book */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id)
  if (book) {
    res.render("book/book_detail", {
      book: book,
      title: book.title
    });
  } else {
    throw new Error("That book cannot be found :(")
  }

}));

/* Update a book. */
router.post('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  try {
    await book.update(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      await Book.build(req.body);
      res.render("book/book_detail", {
        book: book,
        errors: error.errors,
        title: book.title
      })
    } else {
      throw error;
    }
  }
}));


/* Delete book. */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    throw error;
  }

}));

module.exports = router;