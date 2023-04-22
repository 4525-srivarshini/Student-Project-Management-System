const multer = require('multer');
const xlsx = require('xlsx');
const User = require('../models/userSchema');
const express = require('express');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async(req, res) => {
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const uniqueData = data.filter((value, index, self) =>
        index === self.findIndex((v) => (
            v.registrationNo === value.registrationNo &&
            v.name === value.name &&
            v.email === value.email
        ))
    );

    const users = uniqueData.map(row => ({
        name: row.name,
        email: row.email,
        registrationNo: row.registrationNo,
        userType: row.userType,
        cgpa: row.cgpa,
        specialization: row.specialization,
        userPassword: row.userPassword,
        userCnfrmPass: row.userCnfrmPass
    }));

    try {
        await User.insertMany(users);
        res.send('File uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file');
    }
});


module.exports = router;