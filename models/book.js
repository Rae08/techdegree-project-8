'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please enter a title"
        },
        notNull: {
          msg: "Please enter a title"
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please enter an author"
        },
        notNull: {
          msg: "Please enter an author"
        }
      }
    },
    year: Sequelize.INTEGER,
    genre: Sequelize.STRING
  }, {
    sequelize
  });

  return Book;
};