const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

const _checkDbResponse = function(dbResponse){
    //check if artist exists with given id
    if(dbResponse === null){ 
        const response = {
            status: process.env.FILE_NOT_FOUND_STATUS_CODE,
            message: process.env.INVALID_IDENTIFIER_MESSAGE
        };
        return response;
    } 
}

//check if id provided is valid document objectid type
const _validateObjectId = function(id){
    const validObjectId = mongoose.isValidObjectId(id);
    if(!validObjectId){
        const response = {
            status: process.env.FILE_NOT_FOUND_STATUS_CODE,
            message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE + id
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

const getOne = function(req, res){
    const userId = req.params.userId;

    //validate if provided artistId is valid document id
    const response = _validateObjectId(userId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    User.findById(userId).exec(function(err, users){
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
        const response ={
            status: process.env.CLIENT_ERROR_STATUS_CODE,
            message: process.env.PASSWORD_EMPTY_MESSAGE
        }
        _sendResponse(res, response);
        return;
    }

    //this is the variable to increase the complexity of the hasing algorithm
    const saltRound = parseInt(process.env.SALT_NUMBER_OF_ROUNDS, process.env.NUMBER_BASE);

    bcrypt.genSalt(saltRound, function(err, salt){ //nested callback chain or callback hell
        let response = _checkError(err); //if there is error while generating salt
        if(response){
            _sendResponse(res, response);
        } else {
            bcrypt.hash(req.body.password, salt, function(err, passwordHash){
                let response = _checkError(err); //if there is error while getting password hash
                if(response){
                    _sendResponse(res, response);
                } else {
                    const newUser = {
                        name: req.body.user,
                        username: req.body.username,
                        password: passwordHash
                    };
                
                    User.create(newUser, function(err, user){
                        let response = _checkError(err); // check error if there is error while creating user
                        if(!response){
                            response = {
                                status: process.env.CREATE_SUCCESS_STATUS_CODE,
                                message: user
                            }
                        }
                
                        _sendResponse(res, response);
                    })
                }
            })
        }
    });
}

const deleteOne = function(req, res) {
    console.log("Delete artist request received");
    const userId = req.params.userId;

    //validate if provided artistId is valid document id
    const response = _validateObjectId(userId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    User.findByIdAndDelete(userId).exec(function(err, user){
        //check error response
        let response = _checkError(err);
        if(!response){
            response = _checkDbResponse(user);
            if(!response){
                response = {
                    status: process.env.UPDATE_SUCCESS_STATUS_CODE,
                    message: user
                }
            }
        }

        _sendResponse(res, response);
    })
};

const loginSync = function(req, res){
    console.log('Login request received');
    const username = req.body.username;
    const password = req.body.password;

    const user = {username: username};
    User.findOne(user).exec(function(err, user){
        let response = _checkError(err);
        if(!response){
            if(!user){
                response = {
                    status: process.env.FILE_NOT_FOUND_STATUS_CODE,
                    message: process.env.INVLAID_CREDENTIAL_MESSAGE
                }
                
            } else {
                //compare
                const passwordMatch = bcrypt.compareSync(password, user.password);
                if(passwordMatch){
                    response = {
                        status: process.env.OK_STATUS_CODE,
                        message: user
                    }
                } else {
                    response = {
                        status: process.env.FILE_NOT_FOUND_STATUS_CODE,
                        message: process.env.INVLAID_CREDENTIAL_MESSAGE
                    }
                }
            }
        }

        _sendResponse(res, response);
    })
}

const login = function(req, res){
    console.log('Login request received');
    const username = req.body.username;
    const password = req.body.password;

    const user = {username: username};
    User.findOne(user).exec(function(err, user){
        
        let response = _checkError(err);
        if(response){
            _sendResponse(res, response);
        } else {
            if(!user){
                response = {
                    status: process.env.FILE_NOT_FOUND_STATUS_CODE,
                    message: process.env.INVLAID_CREDENTIAL_MESSAGE
                }
                _sendResponse(res, response);
            } else {
                //compare
                bcrypt.compare(password, user.password, function(err, match){
                    let response = _checkError(err);
                    if(!response){
                        if(match){
                            response = {
                                status: process.env.OK_STATUS_CODE,
                                message: user
                            }
                        } else {
                            response = {
                                status: process.env.FILE_NOT_FOUND_STATUS_CODE,
                                message: process.env.INVLAID_CREDENTIAL_MESSAGE
                            }
                        }
                    }

                    //reduce termination point
                    _sendResponse(res, response);
                })
            }
        }
    })
}

module.exports = {
    getAll,
    getOne,
    addUser,
    deleteOne,
    login
}