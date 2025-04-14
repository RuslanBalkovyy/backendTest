const express = require('express');
const cors = require('cors');
const app = express();
const logger = require("./util/logger");
const userController = require("./controller/userController");
const { authenticateToken } = require("./util/jwt");

// const session = require("express-session");

const PORT = 3000;
app.use(cors())

app.use(express.json());

app.use(loggerMiddleware);

// app.use(session({
//     secret: "my-secret-key",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false,
//         maxAge: 24 * 60 * 60 * 1000
//     }
// }))

app.use("/users", userController);

function loggerMiddleware(req, res, next) {
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
}

app.get("/", (req, res) => {
    res.send("Home Page");
});

// app.get('/protected', (req, res) => {
//     const username = req.session.username; // retrieve data from the session
//     if(username){
//         res.send("You can access this");
//     }else{
//         res.status(403).send("You can't access this");
//     }
// });

app.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "Accessed Protected Route", user: req.user });
})

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})