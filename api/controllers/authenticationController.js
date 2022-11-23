const jwt = require('jsonwebtoken');
const util = require('util');
const { debugLog, getEnv } = require('../utilities');
const { createResponse, sendResponse } = require('./baseController');

const authenticate = function(req, res, next){
    debugLog('Authenticate called');
    const response = createResponse(getEnv('FORBIDDEN_ERROR_STATUS_CODE'));

    const authToken = req.headers.authorization;
    if(authToken){
        //converting synchronus method to asynchronous with the help of promise
        const jwtVerifyPromise = util.promisify(jwt.verify, {context: jwt});
        jwtVerifyPromise(authToken, getEnv('JWT_PASSWORD'))
            .then(() => next())
            .catch(() => {
                response.status = getEnv('UNAUTHORIZED_ERROR_STATUS_CODE');
                response.message = getEnv('UNAUTHORIZED_ERROR_MESSAGE');
                sendResponse(res, response);
            })

    } else {
        sendResponse(res, response);
    }
}

module.exports = {
    authenticate
}