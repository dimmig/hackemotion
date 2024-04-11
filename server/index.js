const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
// Create connection pool
const connection  = mysql.createConnection({
    connectionLimit : 10, // Maximum number of connections in pool
    host            : 'localhost',
    port:             3306,
    user            : 'root',
    password        : '60028081',
    database        : 'Hackemotion'
});

connection.connect(err => {
    if (err) {
        console.error('An error occurred while connecting to the DB:', err);
        process.exit(1);
    }
    console.log('Connected to database successfully!');
});
// Define the endpoint that uses the connection to query the database
app.post('/create-user', (req, res) => {
    const {realName, username, password, birthYear, gender, residence} = req.body
    const query = `INSERT INTO users (login, birthyear, sex, placeofresidence, name, password) VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [username, birthYear, gender, residence, realName, password];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ success: true, data: results });
    });
});

app.get('/login-user', (req, res) => {
    const loginValue = req.query.name;
    const query = `SELECT * FROM Users WHERE login = ?;`;
    connection.query(query, [loginValue], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log(results)
        if (results.length > 0 && results[0].password === req.query.password) {
            return res.status(200).json(results);
        } else {
            return res.status(401).json({ error: 'Internal server error' });
        }
    });
});

// Define a port and start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
