class Borrowing {
    constructor(db) {
        this.db = db;
    }

    checkoutBook(book_id, borrower_id, checkout_date, due_date, callback) {
        const sql = 'INSERT INTO borrowings (book_id, borrower_id, checkout_date, due_date) VALUES (?, ?, ?, ?)';
        this.db.query(sql, [book_id, borrower_id, checkout_date, due_date], callback);
    }

    returnBook(borrowing_id, return_date, callback) {
        const sql = 'UPDATE borrowings SET return_date = ? WHERE id = ?';
        this.db.query(sql, [return_date, borrowing_id], callback);
    }

    getBorrowerBooks(borrower_id, callback) {
        const sql = 'SELECT * FROM borrowings WHERE borrower_id = ? AND return_date IS NULL';
        this.db.query(sql, [borrower_id], callback);
    }

    listOverdueBooks(callback) {
        const currentDate = new Date().toISOString().slice(0, 10);
        const sql = 'SELECT * FROM borrowings WHERE due_date < ? AND return_date IS NULL';
        this.db.query(sql, [currentDate], callback);
    }

    getBorrowingReport(startDate, endDate, callback) {
        const sql = 'SELECT * FROM borrowings WHERE checkout_date BETWEEN ? AND ?';
        this.db.query(sql, [startDate, endDate], callback);
    }

    getOverdueBorrowings(callback) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const oneMonthAgoDate = oneMonthAgo.toISOString().split('T')[0];

        const sql = 'SELECT * FROM borrowings WHERE due_date < ? AND (return_date > due_date OR return_date IS NULL)';
        this.db.query(sql, [oneMonthAgoDate], callback);
    }

    getBorrowingsLastMonth(callback) {
        const currentDate = new Date();
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const startOfMonth = lastMonth.toISOString().split('T')[0];
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).toISOString().split('T')[0];

        const sql = 'SELECT * FROM borrowings WHERE checkout_date BETWEEN ? AND ?';
        this.db.query(sql, [startOfMonth, endOfMonth], callback);
    }
}

module.exports = Borrowing;
