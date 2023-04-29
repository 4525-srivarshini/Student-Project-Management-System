const express = require('express');
const router = express.Router();

const Project = require('../models/project');

// Get distinct project types
router.get('/projectTypes', async(req, res) => {
    try {
        const projectTypes = await Project.distinct('projectType').lean();
        res.status(200).json(projectTypes);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

// Get projects based on selected project type
router.get('/projectsByType/:projectType', async(req, res) => {
    const { projectType } = req.params;

    try {
        const projects = await Project.aggregate([{
                $match: { projectType }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'projectCreator',
                    foreignField: '_id',
                    as: 'projectCreatorDetails'
                }
            },
            {
                $unwind: '$projectCreatorDetails'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members.memberRef',
                    foreignField: '_id',
                    as: 'membersDetails'
                }
            },
            {
                $project: {
                    projectTitle: 1,
                    projectCreatorId: '$projectCreator',
                    projectCreatorName: '$projectCreatorDetails.name',
                    projectCreatorEmail: '$projectCreatorDetails.email',
                    projectCreatorRegistrationNo: '$projectCreatorDetails.registrationNo',
                    projectCreatorUserType: '$projectCreatorDetails.userType',
                    members: {
                        $map: {
                            input: '$members',
                            as: 'member',
                            in: {
                                $mergeObjects: [
                                    '$$member',
                                    {
                                        $arrayElemAt: [{
                                            $filter: {
                                                input: '$membersDetails',
                                                as: 'memberDetail',
                                                cond: {
                                                    $eq: ['$$memberDetail._id', '$$member.memberRef']
                                                }
                                            }
                                        }, 0]
                                    }
                                ]
                            }
                        }
                    },
                    teamNo: 1
                }
            }
        ]);

        res.status(200).json(projects);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});




module.exports = router;