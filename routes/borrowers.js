const express = require('express');
const { body, validationResult, param } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const Borrower = require('../models/borrower');


// Define the rate limit rule
const searchRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many search requests, please try again later.'
});


module.exports = function (db) {
    const borrowerModel = new Borrower(db);

    router.get('/', searchRateLimiter, (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        borrowerModel.getAllBorrowers(page, limit, (err, result) => {
            if (err) {
                res.status(500).send({ error: err.message });
            } else {
                res.status(200).send(result);
            }
        });
    });

    router.post('/', [
        body('name').trim().notEmpty(),
        body('email').isEmail().normalizeEmail(),
        body('registered_date').isISO8601().toDate()
    ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            borrowerModel.addBorrower(req.body, (err, result) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    res.status(201).send({ message: 'Borrower added successfully', borrowerId: result.insertId });
                }
            });
        });

    router.put('/:id', [
        param('id').isInt(),
        body('name').optional().trim().notEmpty(),
        body('email').optional().isEmail().normalizeEmail()
    ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            borrowerModel.updateBorrower(req.params.id, req.body, (err, result) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    res.status(200).send({ message: 'Borrower updated successfully' });
                }
            });
        });

    router.delete('/:id', [
        param('id').isInt()
    ],
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            borrowerModel.deleteBorrower(req.params.id, (err, result) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                } else {
                    res.status(200).send({ message: 'Borrower deleted successfully' });
                }
            });
        });

    return router;
};
