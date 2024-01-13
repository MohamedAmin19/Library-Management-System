const express = require('express');
const { body, validationResult, param } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const Book = require('../models/book');

// Define the rate limit rule
const searchRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many search requests, please try again later.'
});

module.exports = function (db) {
    const bookModel = new Book(db);

    //INPUT => Params for limit and page number
    //OUTPUT => List of books using pagination
    router.get('/', searchRateLimiter, (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        bookModel.getAllBooks(page, limit, (err, result) => {
            if (err) {
                res.status(500).send({ error: err.message });
            } else {
                res.status(200).send(result);
            }
        });
    });

    //INPUT => Param of the query to search with (title, author or ISBN)
    //OUTPUT => List of the books depends on the search query
    router.get('/search', (req, res) => {
        const { query } = req.query;
        if (!query) {
            return res.status(400).send({ error: 'Query parameter is required' });
        }

        bookModel.searchBooks(query, (err, results) => {
            if (err) {
                res.status(500).send({ error: err.message });
            } else {
                res.status(200).send(results);
            }
        });
    });

    //INPUT => Request body with these details(title, author, ISBN(Unique number), quantity, shelf_location)
    //OUTPUT => "Book added successfully"
    router.post('/', [
        body('title').trim().notEmpty(),
        body('author').trim().notEmpty(),
        body('ISBN').trim().notEmpty(),
        body('quantity').isInt({ min: 1 }),
        body('shelf_location').trim().notEmpty()
    ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            bookModel.addBook(req.body, (err, result) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    res.status(201).send({ message: 'Book added successfully', bookId: result.insertId });
                }
            });
        });

    //INPUT => Request body with the updated details(title, author, ISBN(Unique number), quantity, shelf_location)
    //OUTPUT => "Book updated successfully"
    router.put('/:id', [
        param('id').isInt(),
        body('title').trim().notEmpty(),
        body('author').trim().notEmpty(),
        body('ISBN').trim().notEmpty(),
        body('quantity').isInt({ min: 1 }),
        body('shelf_location').trim().notEmpty()
    ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            bookModel.updateBook(req.params.id, req.body, (err, result) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    res.status(200).send({ message: 'Book updated successfully' });
                }
            });
        });

    //INPUT => Id of the book as a url variable
    //OUTPUT => "Book deleted successfully"
    router.delete('/:id', [
        param('id').isInt()
    ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            bookModel.deleteBook(req.params.id, (err, result) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    res.status(200).send({ message: 'Book deleted successfully' });
                }
            });
        });

    return router;
};
