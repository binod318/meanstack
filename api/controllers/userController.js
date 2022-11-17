const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {
    getInt,
    createResponse,
    createErrorResponse,
    createDbResponse,
    sendResponse,
    validateObjectId
} = require('./baseController');

const User = mongoose.model(process.env.USER_MODEL);

const getAll = function(req, res){
    let response = createResponse();
    User.find().exec()
        .then(users => response.message = users)
        .catch(error => response = createErrorResponse(error))
        .finally(() => sendResponse(res, response));
}

const getOne = function(req, res){
    const userId = req.params.userId;

    //validate if provided artistId is valid document id
    let response = validateObjectId(userId);
    if(response){
        sendResponse(res, response);
        return;
    }

    response = createResponse();
    User.findById(userId).exec()
        .then(user => response.message = user)
        .catch(error => response = createErrorResponse(error))
        .finally(() => sendResponse(res, response));
}

const addUserSync = function(req, res){
    console.log("addUser request received");

    /*
    I'm adding this validation here because the password will be filled with encrypted value 
    if the value is sent empty from UI
    */
    if(req.body && !req.body.password){
        const response ={
            status: process.env.CLIENT_ERROR_STATUS_CODE,
            message: process.env.PASSWORD_EMPTY_MESSAGE
        }
        _sendResponse(res, response);
        return;
    }

    const saltValue = bcrypt.genSaltSync(parseInt(process.env.SALT_NUMBER_OF_ROUNDS, process.env.NUMBER_BASE));
    const passwordHash = bcrypt.hashSync(req.body.password, saltValue);

    const newUser = {
        name: req.body.user,
        username: req.body.username,
        password: passwordHash
    };

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

const addUser = function(req, res){
    console.log("addUser request received");

    /*
    I'm adding this validation here because the password will be filled with encrypted value 
    if the value is sent empty from UI
    */
    if(req.body && !req.body.password){
        const response = createResponse(process.env.CLIENT_ERROR_STATUS_CODE, process.env.PASSWORD_EMPTY_MESSAGE);
        sendResponse(res, response);
        return;
    }

    //this is the variable to increase the complexity of the hasing algorithm
    const saltRound = getInt(process.env.SALT_NUMBER_OF_ROUNDS);

    let response = createResponse(process.env.CREATE_SUCCESS_STATUS_CODE);
    bcrypt.genSalt(saltRound)
        .then(salt => {
            if(!salt){
                response = createResponse(process.env.SERVER_ERROR_STATUS_CODE, process.env.SALT_GENERATE_ISSUE_MESSAGE);
                sendResponse(res, response);
            } else {
                bcrypt.hash(req.body.password, salt)
                    .then(passwordHash => {
                        if(!passwordHash){
                            response = createResponse(process.env.SERVER_ERROR_STATUS_CODE, process.env.SALT_GENERATE_ISSUE_MESSAGE);
                            sendResponse(res, response);
                        } else {
                            const newUser = {
                                name: req.body.user,
                                username: req.body.username,
                                password: passwordHash
                            };
                        
                            User.create(newUser)
                                .then(user => response.message = user)
                                .catch(error => response = createErrorResponse(error))
                                .finally(() => sendResponse(res, response));
                        }
                    })
                    .catch(error => {
                        response = createErrorResponse(error);
                        sendResponse(res, response);
                    })
            }
        })
        .catch(error => {
            response = createErrorResponse(error);
            sendResponse(res, response);
        });

    // bcrypt.genSalt(saltRound, function(err, salt){ //nested callback chain or callback hell
    //     let response = _checkError(err); //if there is error while generating salt
    //     if(response){
    //         _sendResponse(res, response);
    //     } else {
    //         bcrypt.hash(req.body.password, salt, function(err, passwordHash){
    //             let response = _checkError(err); //if there is error while getting password hash
    //             if(response){
    //                 _sendResponse(res, response);
    //             } else {
    //                 const newUser = {
    //                     name: req.body.user,
    //                     username: req.body.username,
    //                     password: passwordHash
    //                 };
                
    //                 User.create(newUser, function(err, user){
    //                     let response = _checkError(err); // check error if there is error while creating user
    //                     if(!response){
    //                         response = {
    //                             status: process.env.CREATE_SUCCESS_STATUS_CODE,
    //                             message: user
    //                         }
    //                     }
                
    //                     _sendResponse(res, response);
    //                 })
    //             }
    //         })
    //     }
    // });
}

const deleteOne = function(req, res) {
    console.log("Delete artist request received");
    const userId = req.params.userId;

    //validate if provided artistId is valid document id
    let response = validateObjectId(userId);
    if(response){
        sendResponse(res, response);
        return;
    }

    response = createResponse(process.env.UPDATE_SUCCESS_STATUS_CODE);
    User.findByIdAndDelete(userId).exec()
        .then(user => {
            if(user === null){
                response = createDbResponse();
            } else {
                response.message = user
            }
        })
        .catch(error => response = createErrorResponse(error))
        .finally(() => sendResponse(res, response));

};

const loginSync = function(req, res){
    console.log('Login request received');
    const username = req.body.username;
    const password = req.body.password;

    const user = {username: username};
    let response = createResponse();
    User.findOne(user).exec()
        .then(user => {
            if(!user){
                response = createResponse(process.env.FILE_NOT_FOUND_STATUS_CODE, process.env.INVALID_CREDENTIAL_MESSAGE);
                sendResponse(res, response);
            } else {
                //compare
                const passwordMatch = bcrypt.compareSync(password, user.password);
                if(passwordMatch){
                    response.message= user;
                } else {
                    response = createResponse(process.env.FILE_NOT_FOUND_STATUS_CODE, process.env.INVLAID_CREDENTIAL_MESSAGE);
                }
            }
        })
        .catch(error => response = createErrorResponse(error))
        .finally(() => sendResponse(res, response));
}

const login = function(req, res){
    console.log('Login request received');
    const username = req.body.username;
    const password = req.body.password;

    const user = {username: username};

    let response = createResponse();
    User.findOne(user).exec()
        .then(user => {
            if(!user){
                response = createResponse(process.env.FILE_NOT_FOUND_STATUS_CODE, process.env.INVALID_CREDENTIAL_MESSAGE);
                sendResponse(res, response);
            } else {
                bcrypt.compare(password, user.password)
                    .then(match => {
                        if(match){
                            response.message = user
                        } else {
                            response = createResponse(process.env.FILE_NOT_FOUND_STATUS_CODE, process.env.INVLAID_CREDENTIAL_MESSAGE);
                        }
                    })
                    .catch(error => response = createErrorResponse(error))
                    .finally(() => sendResponse(res, response));
            }
        })
        .catch(error => {
            response = createErrorResponse(error);
            sendResponse(res, response);
        });
}

module.exports = {
    getAll,
    getOne,
    addUser,
    deleteOne,
    login
}