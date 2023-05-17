const express = require('express');
const router = express.Router();
const userAuth = require("../middelware/userAuth");


const User = require('../models/userSchema');
const Categories = require('../models/newCategory');


module.exports = router.post('/alltaskCategories', userAuth, async(req, res) => {
    const { name } = req.body;
    console.log(req.userID)
    const categoriesExist = await Categories.findOne({ userRef: req.userID });

    try {

        if (categoriesExist) {

            categoriesExist.allCatogries.push({
                category: name,
            })

            await ProjectTypeExist.save();

            res.status(201).send({ message: "Category added successfully" });

        } else {
            const data = new ProjectType({
                userRef: req.userID,
                allCatogries: [{
                    category: name
                }]
            });

            await data.save();

            res.status(201).send({ message: "Category added successfully" });
        }

    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});



module.exports = router.post('/deletingCategory', userAuth, async(req, res) => {
    const catId = req.body.catId;

    try {

        const updateProjectType = await ProjectType.updateOne({ userRef: req.userID }, {
            $pull: {
                "allCatogries": { "_id": catId }
            }
        });

        const getProjectType = await ProjectType.findOne({ userRef: req.userID });
        const allCatogries = getProjectType.allCatogries


        res.status(201).send(allCatogries);

    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});



module.exports = router.get('/showProjectType', userAuth, async(req, res) => {
    const getProjectType = await ProjectType.findOne({ userRef: req.userID });
    try {
        if (getProjectType) {
            const allCatogries = getProjectType.allCatogries
            res.status(201).send(allCatogries);
        } else {
            res.status(201).send([]);
        }

    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
});