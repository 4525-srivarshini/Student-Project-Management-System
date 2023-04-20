const express = require('express');
const router = express.Router();

const Project = require('../models/project');

router.get('/projects', async(req, res) => {
    try {
        const projects = await Project.find({}, { projectCreator: 1, teamNo: 1, projectTitle: 1, members: 1 })

        res.status(200).json(projects);
        console.log(projects)
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;