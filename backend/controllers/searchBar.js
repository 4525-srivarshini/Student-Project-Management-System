const express = require('express');
const router = express.Router();
const userAuth = require("../middelware/userAuth");
const User = require('../models/userSchema');


module.exports = router.post('/searchBar', userAuth, async(req, res) => {
    const searchInput = req.body.searchInput;

    const findUsers = await User.find({
        $or: [
            { registrationNo: { $regex: searchInput, $options: 'i' } },
            { email: { $regex: searchInput, $options: 'i' } },
            { name: { $regex: searchInput, $options: 'i' } },
            { specialization: { $regex: searchInput, $options: 'i' } }
        ]
    });
    try {
        if (findUsers) {
            res.status(201).send(findUsers);
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});