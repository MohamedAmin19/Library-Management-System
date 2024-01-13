class Borrower {
    constructor(db) {
        this.db = db;
    }

    getAllBorrowers(page = 1, limit = 10, callback) {
        const startIndex = (page - 1) * limit;
        const sqlCount = 'SELECT COUNT(*) AS total FROM borrowers';
        this.db.query(sqlCount, (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }

            const totalBorrowers = result[0].total;
            const totalPages = Math.ceil(totalBorrowers / limit);
            const sql = 'SELECT * FROM borrowers LIMIT ?, ?';
            this.db.query(sql, [startIndex, limit], (err, results) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, {
                        page,
                        limit,
                        totalPages,
                        totalBorrowers,
                        data: results
                    });
                }
            });
        });
    }

    addBorrower(borrowerDetails, callback) {
        const sql = 'INSERT INTO borrowers (name, email, registered_date) VALUES (?, ?, ?)';
        this.db.query(sql, [borrowerDetails.name, borrowerDetails.email, borrowerDetails.registered_date], callback);
    }

    updateBorrower(id, borrowerDetails, callback) {
        const sql = 'UPDATE borrowers SET name = ?, email = ? WHERE id = ?';
        this.db.query(sql, [borrowerDetails.name, borrowerDetails.email, id], callback);
    }

    deleteBorrower(id, callback) {
        const sql = 'DELETE FROM borrowers WHERE id = ?';
        this.db.query(sql, [id], callback);
    }
}

module.exports = Borrower;
