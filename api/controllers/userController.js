const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getInt, debugLog, getEnv } = require('../utilities');
const {
    handleError,
    checkObjectExistsInDB,
    createResponse,
    createErrorResponse,
    sendResponse,
    validateObjectId
} = require('./baseController');

const User = mongoose.model(getEnv('USER_MODEL'));

const getAll = function(req, res){
    //get value from environment variable
    let offset= getInt(getEnv('DEFAULT_OFFSET'));
    let count= getInt(getEnv('DEFAULT_COUNT'));
    let maxCount = getInt(getEnv('MAX_COUNT'));

    //check query string parameters
    if(req.query && req.query.offset){
        offset = getInt(req.query.offset);
    }
    if(req.query && req.query.count){
        count = getInt(req.query.count);
    }

    // type check of the variables to be used
    if(isNaN(offset) || isNaN(count)){
        const response = createResponse(getEnv('CLIENT_ERROR_STATUS_CODE'), getEnv('PARAMETER_TYPE_ERROR_MESSAGE'));
        sendResponse(res, response);
        return;
    }

    //limit check
    if(count > maxCount){
        const response = createResponse(getEnv('CLIENT_ERROR_STATUS_CODE'), getEnv('LIMIT_EXCEED_MESSAGE'));
        sendResponse(res, response);
        return;
    }

    let response = createResponse();
    User.find()
        .skip(offset)
        .limit(count)
        .then((users) => checkObjectExistsInDB(users, response))
        .catch((error) => handleError(error, response))
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
    User.findById(userId)
        .then((user) => checkObjectExistsInDB(user, response))
        .catch((error) => handleError(error, response))
        .finally(() => sendResponse(res, response));
}

const _checkSaltExists = function(salt, response){
    return new Promise((resolve, reject) => {
        if(!salt){
            debugLog("Salt object doesn't exists");
            response.status = getEnv('SERVER_ERROR_STATUS_CODE'); 
            response.message = getEnv('SALT_GENERATE_ISSUE_MESSAGE');
            reject();
        } else {
            resolve(salt);
        }
    })
}

const _checkPasswordHash = function(passwordHash, req, response){

    return new Promise((resolve, reject) => {
        if(!passwordHash){
            response.status = getEnv('SERVER_ERROR_STATUS_CODE');
            response.message = getEnv('SALT_GENERATE_ISSUE_MESSAGE');
            reject();
        } else {
            const newUser = {
                name: req.body.name,
                username: req.body.username,
                password: passwordHash
            };
        
            User.create(newUser)
                .then((user) => {
                    checkObjectExistsInDB(user, response);
                    resolve();
                })
                .catch((error) => {
                    handleError(error, response);
                    reject();
                });
        }
    })
}

const _createPasswordHash = function(salt, req, response){
    return new Promise((resolve, reject) => {
        bcrypt.hash(req.body.password, salt)
            .then((passwordHash) => {
                _checkPasswordHash(passwordHash, req, response);
                resolve();
            })
            .catch((error) => {
                handleError(error, response);
                reject();
            });
    })
}

const addUser = function(req, res){
    debugLog("addUser request received");

    /*
    I'm adding this validation here because the password will be filled with encrypted value 
    if the value is sent empty from UI
    */
    if(req.body && !req.body.password){
        const response = createResponse(getEnv('CLIENT_ERROR_STATUS_CODE'), getEnv('PASSWORD_EMPTY_MESSAGE'));
        sendResponse(res, response);
        return;
    }

    //this is the variable to increase the complexity of the hasing algorithm
    const saltRound = getInt(getEnv('SALT_NUMBER_OF_ROUNDS'));

    let response = createResponse(getEnv('REATE_SUCCESS_STATUS_CODE'));
    bcrypt.genSalt(saltRound)
        .then((salt) => _checkSaltExists(salt, response))
        .then((salt) => _createPasswordHash(salt, req, response))
        .catch((error) => handleError(error, response))
        .finally(() => sendResponse(res, response));
}

const deleteOne = function(req, res) {
    debugLog("Delete artist request received");
    const userId = req.params.userId;

    //validate if provided artistId is valid document id
    let response = validateObjectId(userId);
    if(response){
        sendResponse(res, response);
        return;
    }

    response = createResponse(getEnv('UPDATE_SUCCESS_STATUS_CODE'));
    User.findByIdAndDelete(userId)
        .then((user) => checkObjectExistsInDB(user, response))
        .catch((error) => handleError(error, response))
        .finally(() => sendResponse(res, response));
};

const loginSync = function(req, res){
    debugLog('Login request received');
    const username = req.body.username;
    const password = req.body.password;

    const user = {username: username};
    let response = createResponse();
    User.findOne(user).exec()
        .then(user => {
            if(!user){
                response = createResponse(getEnv('FILE_NOT_FOUND_STATUS_CODE'), getEnv('INVALID_CREDENTIAL_MESSAGE'));
                sendResponse(res, response);
            } else {
                //compare
                const passwordMatch = bcrypt.compareSync(password, user.password);
                if(passwordMatch){
                    response.message= user;
                } else {
                    response = createResponse(getEnv('FILE_NOT_FOUND_STATUS_CODE'), getEnv('INVLAID_CREDENTIAL_MESSAGE'));
                }
            }
        })
        .catch(error => response = createErrorResponse(error))
        .finally(() => sendResponse(res, response));
}

const _checkPassword = function(password, user, response){
    debugLog('check password!')
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password)
            .then((passwordMatch) => {
                if(passwordMatch){
                    resolve(user);
                } else {
                    response.status = getEnv('FILE_NOT_FOUND_STATUS_CODE');
                    response.message = getEnv('INVALID_CREDENTIAL_MESSAGE');
                    reject();
                }
            })
            .catch(error => {
                handleError(error, response);
                reject()
            });
    })
}

const _generateToken = function(user, response){
    debugLog("generate token");
    const token = jwt.sign({name: user.name}, getEnv('JWT_PASSWORD'), {expiresIn: getInt(getEnv('JWT_EXPIRY_IN_SECOND'))} );
    response.message = { success: true, token: token };
}

const login = function(req, res){
    debugLog('Login request received');
    const username = req.body.username;
    const password = req.body.password;

    const user = {username: username};

    let response = createResponse();
    User.findOne(user).exec()
        .then((user) => checkObjectExistsInDB(user, response))
        .then((user) => _checkPassword(password, user, response))
        .then((user) => _generateToken(user, response))
        .catch((error) => handleError(error, response))
        .finally(() => sendResponse(res, response));
}

module.exports = {
    getAll,
    getOne,
    addUser,
    deleteOne,
    login
}