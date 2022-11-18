const mongoose = require('mongoose');
const { getInt, debugLog } = require('../utilities');


const handleError = function(error, response){
    debugLog('handle error',error, response)
    if(getInt(response.status) < 300){
        response.status = process.env.SERVER_ERROR_STATUS_CODE;
        response.message = error;
    }  
}

const checkObjectExistsInDB = function(entity, response){
    debugLog('check db object!')
    //to chain a promise you need to return promise
    return new Promise((resolve, reject) => {
        if(!entity){
            debugLog("DB object doesn't exists");
            response.status = process.env.FILE_NOT_FOUND_STATUS_CODE; 
            response.message = process.env.DOCUMENT_NOT_FOUND_MESSAGE;
            reject("OKKKKK");
        } else {
            response.message = entity;
            resolve(entity);
        }
    })

    // if(!entity){
    //     debugLog("DB object doesn't exists");
    //     response.status = process.env.FILE_NOT_FOUND_STATUS_CODE; 
    //     response.message = process.env.DOCUMENT_NOT_FOUND_MESSAGE;
    // } else {
    //     response.message = entity;
    // }
}

const createResponse = function(status, message){
    return {
        status: status || process.env.OK_STATUS_CODE,
        message: message || {}
    }
}

const createErrorResponse = function(error){
    return createResponse(process.env.SERVER_ERROR_STATUS_CODE, error);
}

const createDbResponse = function(){
    return createResponse(process.env.FILE_NOT_FOUND_STATUS_CODE, process.env.DOCUMENT_NOT_FOUND_MESSAGE);
}

const sendResponse = function(res, response){
    res.status(getInt(response.status)).json(response.message);
}

//check if id provided is valid document objectid type
const validateObjectId = function(id){
    const validObjectId = mongoose.isValidObjectId(id);
    if(!validObjectId){
        const response = createResponse(process.env.FILE_NOT_FOUND_STATUS_CODE, process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE + id);
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