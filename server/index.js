const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const SECRET_KEY = 'y0u5zrTq1kOa0AyrpdpYFxxzSjv2CrjT+s+PQUeftw8=';
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

const authenticateToken = (req, res, next) => {
    // Retrieve the token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Conventionally, the header is "Bearer TOKEN"
    if (token == null) return res.sendStatus(401); // No token found
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Token verification failed
        req.user = user; // Attach the decoded user data to the request object
        next(); // Proceed to the next middleware
    });
};

app.get('/logged-in-user', authenticateToken, (req, res) => {
    // You can access the decoded user data here
    res.json({ message: 'This is a protected route', userData: req.user });
});
app.post('/create-user', (req, res) => {
    const {realName, username, password, birthYear, gender, residence} = req.body
    const query = `INSERT INTO users (login, birthyear, sex, placeofresidence, name, password) VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [username, birthYear, gender, residence, realName, password];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        const token = jwt.sign({username}, SECRET_KEY, { expiresIn: '30min' });
        res.status(201).json({ success: true, data: {results, token} });
    });
});

app.post('/login-user', (req, res) => {
    const loginValue = req.body.name;
    const password = req.body.password
    const query = `SELECT * FROM Users WHERE login = ?;`;
    connection.query(query, [loginValue], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log("RESULTS ", results)
        if (results.length > 0 && results[0].password === password) {
            const token = jwt.sign({loginValue}, SECRET_KEY, { expiresIn: '1h' });
            console.log("SUCCESS")
            return res.status(200).json({results, token});

        } else {
            return res.status(401).json({ error: 'Internal server error' });
        }
    });
});

app.get('/get-user', (req, res) => {
    const loginValue = req.query.name;
    const query = `SELECT * FROM Users WHERE login = ?;`;
    connection.query(query, [loginValue], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(200).json(results)
    });
});

app.post('/create-user-session', (req, res) => {
    const {startTime, endTime, age, typeOfSession, loggedInUser} = req.body;
    const query = `INSERT INTO training_session (age, endedat, login, startedat, typeofsession) VALUES (?, ?, ?, ?, ? )`;
    const values = [age, endTime, loggedInUser, startTime, typeOfSession];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({error: 'Internal server error'});
        }
        res.status(201).json({success: true, data: {results}});
    })
})

app.get('/get-user-session', (req, res) => {
    const userId = req.query.email;
    const query = `SELECT * FROM training_session WHERE login = ?;`;

    connection.query(query, [userId], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length > 0) {
            return res.status(200).json({success:true, data: results})
        } else {
            return res.status(404).json({success:false})
        }
    });
});

app.post('/create-user-session-result', (req, res) => {
    const {sessionId, recognizedEmotions, startedAt, endTime} = req.body;
    const stringArr = recognizedEmotions.join(",")
    const query = `INSERT INTO session_results (endedAt, recognizedEmotions, sessionid, startedAt) VALUES (?, ?, ?, ? )`;
    const values = [endTime, stringArr, sessionId, startedAt];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length > 0) {
            return res.status(200).json({success:true, data: results})
        } else {
            return res.status(404).json({success:false})
        }
    });
});


app.get('/get-emotion-images', async (req, res) => {
    try {
        const images = await getEmotionImages(req.query.dirPath);
        res.json(images);
    } catch (error) {
        console.error("Server error when fetching emotion images:", error);
        res.status(500).send("Internal Server Error");
    }
});

const getEmotionImages = async (dirPath) => {
    try {
        let files = await fs.readdir(dirPath);

        let groupedFiles = {};
        files.forEach(file => {
            const emotion = file.split(/\d/)[0]; // Split the filename by the number and get the emotion name
            if (!groupedFiles[emotion]) {
                groupedFiles[emotion] = [];
            }
            groupedFiles[emotion].push(file);
        });

        let selectedFiles = [];
        for (let emotion in groupedFiles) {
            // Sort the files to ensure they are in the correct order
            const sortedFiles = groupedFiles[emotion].sort();
            // Only consider the first 3 images of each emotion for selection
            const choices = sortedFiles.slice(0, 3);
            // Randomly select one of the first three images
            const index = Math.floor(Math.random() * choices.length);
            selectedFiles.push(choices[index]);
        }

        return selectedFiles;
    } catch (err) {
        console.error(err);
        throw new Error('Error reading directory');
    }
};



// Define a port and start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
