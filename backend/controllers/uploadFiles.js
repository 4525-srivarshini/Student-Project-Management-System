const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../models/students');

const app = express();
app.use(express.json());


// Endpoint for uploading CSV file
module.exports = router.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Read the uploaded CSV file
    const file = req.files.file;
    const data = [];
    fs.createReadStream(file.tempFilePath)
        .pipe(csv())
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            // Save the data to MongoDB
            Users.create(data)
                .then(() => {
                    res.send('Data uploaded successfully.');
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).send('Error uploading data.');
                });
        });
});