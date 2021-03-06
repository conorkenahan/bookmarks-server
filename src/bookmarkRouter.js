const express = require("express");
const { v4: uuid } = require("uuid");
const logger = require("./logger");
const bookmarks = require("../store");

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route("/bookmarks")
  .get((req, res) => {
    res.json(bookmarks);
  })
  //why are we using bodyParser? what is that?
  .post(bodyParser, (req, res) => {
    const { title, url, rating, desc } = req.body;
    if (!title) {
      logger.error("Title is required");
      return res.status(400).send("invalid data");
    }
    if (!url) {
      logger.error(`URL is required`);
      return res.status(400).send("Invalid data");
    }
    if (!rating) {
      logger.error(`Rating is required`);
      return res.status(400).send("Invalid data");
    }
    if (!desc) {
      logger.error(`Description is required`);
      return res.status(400).send("Invalid data");
    }
    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      rating,
      desc,
    };
    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmarks);
  });

bookmarkRouter
  .route("/bookmarks/:id")
  .get((req, res) => {
    //why are we putting id in {} and not bookmark
    const { id } = req.params;
    const bookmark = bookmarks.find((bookmark) => bookmark.id == id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send("Bookmark not found");
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex((bookmark) => bookmark.id == id);

    //why are we checking if it is equal to -1?
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send("Not found");
    }

    bookmarks.splice(bookmarkIndex, 1);
    res.json(bookmarks);
    logger.info(`Bookmark with id ${id} deleted`);
    res.status(204).end();
  });

module.exports = bookmarkRouter;

// {
//   id: 0,
//   title: 'Google',
//   url: 'http://www.google.com',
//   rating: '3',
//   desc: 'Internet-related services and products.'
// },
