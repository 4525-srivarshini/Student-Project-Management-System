const express = require('express');
const router = express.Router();


const User = require('../models/userSchema');

router.get('/students', async(req, res) => {
    try {
        const users = await User.aggregate([
            { $match: { userType: "student" } },
            { $group: { _id: "$batchNo" } },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});


router.get('/students/batches', async(req, res) => {
    try {
        const studentCounts = await User.aggregate([
            { $match: { userType: 'student' } },
            {
                $group: {
                    _id: '$batchNo',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json(studentCounts);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});


router.get('/students/:batchNo', async(req, res) => {
    try {
        const batchNo = req.params.batchNo;

        // Get unique sections for the batch
        const uniqueSections = await User.distinct('section', {
            userType: 'student',
            batchNo: batchNo
        });

        res.status(200).json({ sections: uniqueSections });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

router.get('/students/:batchNo/:section', async(req, res) => {
    try {
        const batchNo = req.params.batchNo;
        const section = req.params.section;

        // Fetch students with the selected section in the specified batch
        const students = await User.find({
            userType: 'student',
            batchNo: batchNo,
            section: section
        });

        res.status(200).json(students);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});


router.delete('/students/deleteStudents/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;