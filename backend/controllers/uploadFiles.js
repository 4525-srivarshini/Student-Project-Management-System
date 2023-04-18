const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();


// Multer Configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Express Routes
app.post("/upload-csv", upload.single("file"), (req, res) => {
    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
            const MyModel = mongoose.model("MyModel", {
                name: String,
                age: Number,
                gender: String,
            });

            MyModel.insertMany(results, (err, docs) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error uploading CSV file to database");
                } else {
                    console.log("CSV file uploaded to database successfully");
                    res.status(200).send("CSV file uploaded to database successfully");
                }
            });
        });
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});