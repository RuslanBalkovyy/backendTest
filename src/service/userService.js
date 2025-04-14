const userDAO = require("../repository/userDAO");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const secretKey = "my-secret-key";

async function postUser(user){

    const saltRounds = 10;
    const password = await bcrypt.hash(user.password, saltRounds);

    if(validateUser(user)){
        const data = await userDAO.postUser({
            username: user.username,
            password,
            user_id: uuid.v4()
        });
        return data;
    }else{
        return null;
    }
}

async function validateLogin(username, password){
    const user = await getUserByUsername(username);
    if(user && (await bcrypt.compare(password, user.password)) ){
        return user;
    }else{
        return null;
    }
}

async function getUserByUsername(username){
    if(username){
        const data = await userDAO.getUserByUsername(username);
        if(data){
            return data;
        }else{
            return null;
        }
    }{
        return null;
    }
}

async function getUserById(userId){
    if(userId){
        const data = await userDAO.getUserById(userId);
        if(data){
            return data;
        }else{
            return null;
        }
    }{
        return null;
    }
}

function validateUser(user){
    const usernameResult = user.username.length > 0;
    const passwordResult = user.password.length > 0;
    return (usernameResult && passwordResult);
}


module.exports = {
    postUser,
    validateLogin,
    getUserById
}