const express = require('express');
const router = express.Router();
const multer = require("multer");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require('google-auth-library');

const upload = multer({ dest: 'uploads/' });

const User = require('../models/userSchema');



{
    /*module.exports = router.post('/createNewUser', upload.single("userImage"), async(req, res) => {
        const { userName, userEmail, userPassword, userCnfrmPass, registrationNo, userType, cgpa, specialization } = req.body;
        const userImage = req.file;

        if (!userName || !userEmail || !userPassword || !userCnfrmPass || !userType) {
            return res.status(422).json({ error: "Please fill in all required fields" })
        }

        const userExist = await User.findOne({ email: userEmail });
        try {
            if (userExist) {
                return res.status(201).json({ message: "User already exists." })
            } else if (userPassword !== userCnfrmPass) {
                return res.status(422).json({ error: "Passwords do not match" })
            } else {
                let data;

                if (userType === 'student') {
                    if (!cgpa) {
                        return res.status(422).json({ error: "Please enter your CGPA" })
                    }
                    data = new User({
                        name: userName,
                        email: userEmail,
                        userPassword: userPassword,
                        userCnfrmPass: userCnfrmPass,
                        registrationNo: registrationNo,
                        imageName: userImage.originalname,
                        image: userImage.path,
                        imageType: userImage.mimetype,
                        imageSize: userImage.size,
                        userType: userType,
                        cgpa: cgpa
                    });
                } else if (userType === 'supervisor') {
                    if (!specialization) {
                        return res.status(422).json({ error: "Please enter your specialization" })
                    }
                    data = new User({
                        name: userName,
                        email: userEmail,
                        userPassword: userPassword,
                        userCnfrmPass: userCnfrmPass,
                        imageName: userImage.originalname,
                        image: userImage.path,
                        imageType: userImage.mimetype,
                        imageSize: userImage.size,
                        userType: userType,
                        specialization: specialization
                    });
                } else if (userType === 'admin') {
                    data = new User({
                        name: userName,
                        email: userEmail,
                        userPassword: userPassword,
                        userCnfrmPass: userCnfrmPass,
                        imageName: userImage.originalname,
                        image: userImage.path,
                        imageType: userImage.mimetype,
                        imageSize: userImage.size,
                        userType: userType,
                    });
                } else {
                    return res.status(422).json({ error: "Invalid user type" })
                }

                await data.save();

                const newUser = await User.findOne({ email: userEmail });

                let token = await newUser.generateAuthToken();

                const url = `http://localhost:5000/verify/${token}`


                res.status(201).json({ message: `Account Created Successfully ` });
            }
        } catch (error) {
            res.status(500).send(error.message);
            console.log(error);
        }
    });*/
}



module.exports = router.post('/signInUser', async(req, res) => {
    const { userEmail, userPassword } = req.body;

    const userExist = await User.findOne({ email: userEmail });

    if (!userExist) {
        return res.status(404).send({
            message: "User does not exist"
        });
    }

    const matchPassword = userPassword === userExist.userPassword;

    try {
        if (matchPassword) {
            const userProfile = {
                id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                image: userExist.image,
                registrationNo: userExist.registrationNo,
                userType: userExist.userType,
                cgpa: userExist.cgpa,
                specialization: userExist.specialization,
                batchNo: userExist.batchNo,
                department: userExist.department,
                section: userExist.section,
            };

            let token = await userExist.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })

            res.status(201).json(userProfile);
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
});






module.exports = router.get('/verify/:token', async(req, res) => {
    const { token } = req.params

    if (!token) {
        return res.status(4222).send({ message: "Token not found" });
    }

    try {

        let payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

        const user = await User.findOne({ _id: payload._id }).exec();
        if (!user) {
            return res.status(404).send({
                message: "User does not  exists"
            });
        }

        user.accountVerified = true;
        await user.save();
        return res.status(200).send({
            message: "Account Verified"
        });
    } catch (err) {
        return res.status(500).send(err);
    }

});

module.exports = router.get('/userSignOut', async(req, res) => {
    res.clearCookie("jwtoken");
    res.status(201).send({ message: "logout successfull" });

});