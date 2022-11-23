const mongoose = require('mongoose');
const { getInt, debugLog, getEnv } = require('../utilities');

const handleError = function(error, response){
    debugLog('handle error',error, response)
    if(getInt(response.status) < 300){
        response.status = getEnv('SERVER_ERROR_STATUS_CODE');
        response.message = error;
    }  
}

const checkObjectExistsInDB = function(entity, response){
    debugLog('check db object!')
    //to chain a promise you need to return promise
    return new Promise((resolve, reject) => {
        if(!entity){
            debugLog("DB object doesn't exists");
            response.status = getEnv('FILE_NOT_FOUND_STATUS_CODE'); 
            response.message = getEnv('DOCUMENT_NOT_FOUND_MESSAGE');
            reject();
        } else {
            response.message = entity;
            resolve(entity);
        }
    })
}

const createResponse = function(status, message){
    return {
        status: status || getEnv('OK_STATUS_CODE'),
        message: message || {}
    }
}

const createErrorResponse = function(error){
    return createResponse(getEnv('SERVER_ERROR_STATUS_CODE'), error);
}

const createDbResponse = function(){
    return createResponse(getEnv('FILE_NOT_FOUND_STATUS_CODE'), getEnv('DOCUMENT_NOT_FOUND_MESSAGE'));
}

const sendResponse = function(res, response){
    res.status(getInt(response.status)).json(response.message);
}

//check if id provided is valid document objectid type
const validateObjectId = function(id){
    const validObjectId = mongoose.isValidObjectId(id);
    if(!validObjectId){
        const response = createResponse(getEnv('FILE_NOT_FOUND_STATUS_CODE'), getEnv('INVALID_DOCUMENT_OBJECT_ID_MESSAGE') + id);
        return response;
    }
}

module.exports = {
    handleError,
    checkObjectExistsInDB,
    createResponse,
    createErrorResponse,
    createDbResponse,
    sendResponse,
    validateObjectId
}