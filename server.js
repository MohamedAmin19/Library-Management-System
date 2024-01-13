const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const dotenv = require('dotenv');
const basicAuthMiddleware = require('./authMiddleware');

dotenv.config();
const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// Import Routes
const booksRouter = require('./routes/books')(db);
const borrowerRoutes = require('./routes/borrowers')(db);
const borrowingRoutes = require('./routes/borrowings')(db);

// Use Routes
app.use(basicAuthMiddleware);
app.use('/api/v1/books', booksRouter);
app.use('/api/v1/borrowers', borrowerRoutes);
app.use('/api/v1/borrowings', borrowingRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
