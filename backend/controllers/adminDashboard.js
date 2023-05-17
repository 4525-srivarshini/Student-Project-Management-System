const express = require('express');
const router = express.Router();

const User = require('../models/userSchema');
const Project = require('../models/project');

// Endpoint to get the unique batch numbers and student count
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

router.get('/supervisorsCount', async(req, res) => {
    try {
        const supervisorCount = await User.countDocuments({ userType: "supervisor" });

        res.status(200).json({
            count: supervisorCount
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

router.get('/projectTypes/admin', async(req, res) => {
    try {
        const projectTypes = await Project.aggregate([{
            $group: {
                _id: '$projectType',
                count: { $sum: 1 }
            }
        }]);

        res.status(200).json(projectTypes);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});




module.exports = router;