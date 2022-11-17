const mongoose = require('mongoose');

const getInt = function(num){
    return parseInt(num, process.env.NUMBER_BASE);
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
    getInt,
    createResponse,
    createErrorResponse,
    createDbResponse,
    sendResponse,
    validateObjectId
}