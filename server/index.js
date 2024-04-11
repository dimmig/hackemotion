const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(cors());

// Create connection pool
const connection  = mysql.createConnection({
    connectionLimit : 10, // Maximum number of connections in pool
    host            : 'DESKTOP-I8GNR9D',
    port:             3306,
    user            : 'D7JU09',
    password        : 'D7JU09',
    database        : 'Bazy2024'
});

connection.connect(err => {
    if (err) {
        console.error('An error occurred while connecting to the DB:', err);
        process.exit(1);
    }
    console.log('Connected to database successfully!');
});
// Define the endpoint that uses the connection to query the database
app.get('/data', (req, res) => {
    connection.query('SELECT * FROM Users', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log(results);
        res.json(results);
    });
});

// Define a port and start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
