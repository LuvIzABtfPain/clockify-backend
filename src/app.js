// backend/src/app.js
const config = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');
const app = express();
const axios = require('axios');

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

app.post('/save-api-key', async (req, res) => {
    const { userID, apiKey } = req.body;
    // get user ID by https://api.clockify.me/api/v1/user with header x-api-key = apiKey
    try {
        const response = await axios.get('https://api.clockify.me/api/v1/user', {
            headers: { 'x-api-key': apiKey }
        });

        const { email, name, id } = response.data;
        const query = `
            INSERT INTO oncademy_apikey (userID, apikey, email, name, clockifyUID)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE apikey = VALUES(apikey), email = VALUES(email), name = VALUES(name), clockifyUID = VALUES(clockifyUID)
        `;
        db.query(query, [userID, apiKey, email, name, id], (err, results) => {
            if (err) {
                res.json(err);
            } else {
                res.json({ hasApiKey: true, 'apikey': apiKey });
            }
        });
    } catch (e) {
        res.json({error: 'Failed to fetch user details from Clockify API', details: e.message})
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});