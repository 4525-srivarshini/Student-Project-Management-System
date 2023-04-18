const mongoose = require('mongoose');

const students = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    registrationNo: {
        type: String,
    },
    userPassword: {
        type: String,
    },
    cgpa: {
        type: Number,
    },
})


const Students = mongoose.model('students', students);

module.exports = Students;