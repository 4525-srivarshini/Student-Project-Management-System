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




const createTransporter = async() => {
    const oauth2Client = new OAuth2Client(
        process.env.GOOGLE_MAIL_CLIENT_ID,
        process.env.GOOGLE_MAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_MAIL_REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject("Failed to create access token :(");
            }
            resolve(token);
        });
    });


    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_EMAIL,
            accessToken,
            clientId: process.env.GOOGLE_MAIL_CLIENT_ID,
            clientSecret: process.env.GOOGLE_MAIL_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_MAIL_REFRESH_TOKEN
        }
    });

    return transporter;
};

module.exports = router.post('/googleSignIn', async(req, res) => {
    const recievedToken = req.body.jwtIDToken

    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
    );

    try {

        const ticket = await client.verifyIdToken({
            idToken: recievedToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const userExist = await User.findOne({ email: payload.email });

        if (userExist) {

            await User.updateOne({ "_id": userExist._id }, {
                $set: {
                    name: payload.name,
                    image: payload.picture,
                    userType: payload.userType,
                    registrationNo: payload.registrationNo,
                    cgpa: payload.cgpa,
                    specialization: payload.specialization,
                }
            });

            let token = await userExist.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })

            const userProfile = {
                id: userExist._id,
                name: payload.name,
                email: payload.email,
                image: payload.picture,
                registrationNo: payload.registrationNo,
                userType: payload.userType,
                cgpa: payload.cgpa,
                specialization: payload.specialization,
            };

            console.log("user updated")
            res.status(201).send(userProfile)

        } else {
            const data = new User({
                name: payload.name,
                email: payload.email,
                image: payload.picture,
                registrationNo: payload.registrationNo,
                userType: payload.userType,
                cgpa: payload.cgpa,
                specialization: payload.specialization,
            });

            await data.save();

            const newUser = await User.findOne({ email: payload.email });

            let token = await newUser.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })

            const userProfile = {
                id: newUser._id,
                name: payload.name,
                email: payload.email,
                image: payload.picture,
                registrationNo: payload.registrationNo,
                userType: payload.userType,
                cgpa: payload.cgpa,
                specialization: payload.specialization,
            };

            res.status(201).send(userProfile)
        }

    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
});





module.exports = router.post('/createNewUser', upload.single("userImage"), async(req, res) => {
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
});


module.exports = router.post('/signInUser', async(req, res) => {
    const { userEmail, userPassword } = req.body;

    const userExist = await User.findOne({ email: userEmail });

    if (!userExist) {
        return res.status(404).send({
            message: "User does not exist"
        });
    }

    const matchPassword = await bcrypt.compare(userPassword, userExist.userPassword);

    try {
        if (userExist && matchPassword) {



            const userProfile = {
                id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                image: userExist.image,
                registrationNo: userExist.registrationNo,
                userType: userExist.userType,
                cgpa: userExist.cgpa,
                specialization: userExist.specialization,
            };

            let token = await userExist.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })


            res.status(201).json(userProfile);

        } else {
            res.status(400).json({ message: "invalid crededntials" })
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