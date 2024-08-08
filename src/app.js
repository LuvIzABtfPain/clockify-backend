// backend/src/app.js
const config = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/get-api-key-by-user-id/:userID', (req, res) => {
    const userID = req.params.userID;
    db.query('SELECT apikey FROM oncademy_apikey WHERE userID = ?', [userID], (err, results) => {
        if(err) {
            res.json(err)
        } else {
            res.json({ hasApiKey: results.length > 0, apikey: results[0] ? results[0].apikey : null });
        }
    });
});

app.post('/save-api-key', (req, res) => {
    const { userID, apiKey } = req.body;
    const query = `
        INSERT INTO oncademy_apikey (userID, apikey)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE apikey = VALUES(apikey)
    `;
    db.query(query, [userID, apiKey], (err, results) => {
        if (err) {
            res.json(err);
        } else {
            res.json({ hasApiKey: true, 'apikey': apiKey });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});