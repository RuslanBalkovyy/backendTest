const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const secretKey = "my-secret-key";

const userService = require("../service/userService");
const { authenticateToken } = require('../util/jwt');
const { log } = require('winston');

router.post("/", validatePostUser, async (req, res) => {
    const data = await userService.postUser(req.body);
    if (data) {
        res.status(201).json({ message: `Created User ${JSON.stringify(req.body)}` });
    } else {
        res.status(400).json({ message: "User not created", data: req.body });
    }
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(`${username} ${password}`);

    const data = await userService.validateLogin(username, password);
    console.log(data);
    if (data) {
        // req.session.username = username;
        const token = jwt.sign(
            {
                id: data.user_id,
                username
            },
            secretKey,
            {
                expiresIn: "15m"
            })
        res.status(200).json({ message: "You have logged in!", token });
    } else {
        res.status(401).json({ message: "Invalid login" });
    }
})

// router.get("/logout", (req, res) => {
//     req.session.destroy((err) => {
//         if(err){
//             logger.error("Error destroying session", err);
//         }
//         res.redirect("/");
//     })
// });

function validatePostUser(req, res, next) {
    const user = req.body;
    if (user.username && user.password) {
        next();
    } else {
        res.status(400).json({ message: "Invalid username or password", data: user });
    }
}

module.exports = router;