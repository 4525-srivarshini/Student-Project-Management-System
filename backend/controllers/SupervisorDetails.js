const express = require('express');
const router = express.Router();


const User = require('../models/userSchema');

router.get('/supervisors', async(req, res) => {
    try {
        const users = await User.find({ userType: "supervisor" }, { name: 1, email: 1, specialization: 1 });
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});


router.delete('/supervisors/deleteSupervisor/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Supervisor not found' });
        }

        return res.status(200).json({ message: 'Supervisor deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;