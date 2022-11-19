const jwt = require('jsonwebtoken');
const util = require('util');
const { debugLog } = require('../utilities');
const { createResponse, sendResponse } = require('./baseController');

const authenticate = function(req, res, next){
    debugLog('Authenticate called');
    const response = createResponse(process.env.FORBIDDEN_ERROR_STATUS_CODE);

    const authToken = req.headers.authorization;
    if(authToken){
        //converting synchronus method to asynchronous with the help of promise
        const jwtVerifyPromise = util.promisify(jwt.verify, {context: jwt});
        jwtVerifyPromise(authToken, process.env.JWT_PASSWORD)
            .then(() => next())
            .catch((error) => {
                console.log(error);
                response.status = process.env.UNAUTHORIZED_ERROR_STATUS_CODE;
                response.message = process.env.UNAUTHORIZED_ERROR_MESSAGE;
                sendResponse(res, response);
            })

    } else {
        sendResponse(res, response);
    }
}

module.exports = {
    authenticate
}