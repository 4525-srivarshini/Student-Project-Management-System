const express = require('express');
const router = express.Router();


const User = require('../models/userSchema');

router.get('/students', async(req, res) => {
    try {
        const users = await User.find({ userType: "student" }, { name: 1, registrationNo: 1, email: 1, cgpa: 1 });
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;