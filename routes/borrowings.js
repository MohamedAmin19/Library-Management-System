const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const { Parser } = require('json2csv');
const router = express.Router();
const Borrowing = require('../models/borrowing');

module.exports = (db) => {
    const borrowingModel = new Borrowing(db);

    //INPUT => Request body with these details(book_id, borrower_id, checkout_date, due_date)
    //OUTPUT => "Book checked out successfully"
    router.post('/checkout', [
        body('book_id').isInt(),
        body('borrower_id').isInt(),
        body('checkout_date').isISO8601(),
        body('due_date').isISO8601()
    ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { book_id, borrower_id, checkout_date, due_date } = req.body;
            borrowingModel.checkoutBook(book_id, borrower_id, checkout_date, due_date, (err, result) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    res.status(201).send({ message: 'Book checked out successfully' });
                }
            });
        });

    //INPUT => Request body with these details(borrowing_id, return_date)
    //OUTPUT => "Book returned successfully"
    router.post('/return', [
        body('borrowing_id').isInt(),
        body('return_date').isISO8601()
    ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { borrowing_id, return_date } = req.body;
            borrowingModel.returnBook(borrowing_id, return_date, (err, result) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    res.status(200).send({ message: 'Book returned successfully' });
                }
            });
        });

    // BorrowerId of the book as a url variable
    // List of books the borrower currently have 
    router.get('/borrower/:borrowerId', [
        param('borrowerId').isInt()
    ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            borrowingModel.getBorrowerBooks(req.params.borrowerId, (err, results) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    res.status(200).send(results);
                }
            });
        });

    // OUTPUT => List Overdue Books
    router.get('/overdue', (req, res) => {
        borrowingModel.listOverdueBooks((err, results) => {
            if (err) {
                res.status(500).send({ error: err.message });
            } else {
                res.status(200).send(results);
            }
        });
    });

    //INPUT => Params for startDate and endDate
    //OUTPUT => CVS report for the borrowing process in a specific period depends on the startDate and endDate
    router.get('/report/csv', [
        query('startDate').isISO8601().withMessage('Invalid start date format'),
        query('endDate').isISO8601().withMessage('Invalid end date format')
    ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { startDate, endDate } = req.query;

            borrowingModel.getBorrowingReport(startDate, endDate, (err, results) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    try {
                        const parser = new Parser();
                        const csv = parser.parse(results);
                        res.header('Content-Type', 'text/csv');
                        res.attachment('report.csv');
                        return res.send(csv);
                    }
                    catch (err) {
                        res.status(500).send({ error: 'Error in exporting data' });
                    }
                }
            });
        });

    //OUTPUT => CVS report for the overdue borrows from the last month    
    router.get('/export/overdue', (req, res) => {
        borrowingModel.getOverdueBorrowings((err, results) => {
            if (err) {
                res.status(500).send({ error: err.message });
            } else {
                try {
                    const parser = new Parser();
                    const csv = parser.parse(results);
                    res.header('Content-Type', 'text/csv');
                    res.attachment('overdue-borrowings.csv');
                    res.send(csv);
                } catch (err) {
                    res.status(500).send({ error: 'Error in exporting data' });
                }
            }
        });
    });

    //OUTPUT => CVS report for the borrowing processes from the last month    
    router.get('/export/lastmonth', (req, res) => {
        borrowingModel.getBorrowingsLastMonth((err, results) => {
            if (err) {
                res.status(500).send({ error: err.message });
            } else {
                try {
                    const parser = new Parser();
                    const csv = parser.parse(results);
                    res.header('Content-Type', 'text/csv');
                    res.attachment('borrowings-last-month.csv');
                    res.send(csv);
                } catch (error) {
                    console.error(error);
                    res.status(500).send({ error: 'Error in exporting data', details: error.message });
                }
            }
        });
    });

    return router;
};
