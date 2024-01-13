class Book {
    constructor(db) {
        this.db = db;
    }

    getAllBooks(page = 1, limit = 10, callback) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Query to get the total count of books
        const sqlCount = 'SELECT COUNT(*) AS total FROM books';
        this.db.query(sqlCount, (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }

            const totalBooks = result[0].total;
            const totalPages = Math.ceil(totalBooks / limit);

            // Query to get the paginated books
            const sql = 'SELECT * FROM books LIMIT ?, ?';
            this.db.query(sql, [startIndex, limit], (err, results) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, {
                        page,
                        limit,
                        totalPages,
                        totalBooks,
                        data: results
                    });
                }
            });
        });
    }

    searchBooks(query, callback) {
        const sql = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR ISBN LIKE ?';
        this.db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`], callback)
    }

    addBook(bookDetails, callback) {
        const sql = 'INSERT INTO books (title, author, ISBN, quantity, shelf_location) VALUES (?, ?, ?, ?, ?)';
        this.db.query(sql, [bookDetails.title, bookDetails.author, bookDetails.ISBN, bookDetails.quantity, bookDetails.shelf_location], callback);
    }

    updateBook(id, bookDetails, callback) {
        const sql = 'UPDATE books SET title = ?, author = ?, ISBN = ?, quantity = ?, shelf_location = ? WHERE id = ?';
        this.db.query(sql, [bookDetails.title, bookDetails.author, bookDetails.ISBN, bookDetails.quantity, bookDetails.shelf_location, id], callback);
    }

    deleteBook(id, callback) {
        const sql = 'DELETE FROM books WHERE id = ?';
        this.db.query(sql, [id], callback);
    }
}

module.exports = Book;
