const mongoose = require('mongoose');

const User = mongoose.model(process.env.USER_MODEL);

const _sendResponse = function(res, response){
    res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
}

const _checkError = function(error){
    //check error response
    if(error){ 
        const response = {
            status: process.env.SERVER_ERROR_STATUS_CODE,
            message: error
        };
        return response;
    }  
}

const getAll = function(req, res){
    User.find().exec(function(err, users){
        let response = _checkError(err);
        if(!response){
            response ={
                status: process.env.OK_STATUS_CODE,
                message: users
            }
        }

        _sendResponse(res, response);
    });
}

const addUser = function(req, res){
    const newUser = {
        name,
        username,
        password,
        confirmPassword
    } = req.body;

    User.create(newUser, function(err, user){

        let response = _checkError(err);
        if(!response){
            response = {
                status: process.env.CREATE_SUCCESS_STATUS_CODE,
                message: user
            }
        }

        _sendResponse(res, response);
    })
}

module.exports = {
    getAll,
    addUser
}