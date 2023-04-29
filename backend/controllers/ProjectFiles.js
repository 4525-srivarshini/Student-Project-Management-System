const express = require('express');
const router = express.Router();

const Project = require('../models/project');

router.get('/projectFilesByType/:projectType', async(req, res) => {
    const { projectType } = req.query;

    try {
        let query = {};
        if (projectType) {
            query = { projectType };
        }

        const projects = await Project.find(query, { teamNo: 1, projectTitle: 1, projectFiles: 1 });

        projects.forEach((project) => {
            project.projectFiles.forEach((file) => {
                file.fileUrl = `${req.protocol}://${req.get('host')}/${file.filePath}`;
            });
        });

        res.status(200).json(projects);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});



module.exports = router;