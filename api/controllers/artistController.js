const mongoose = require('mongoose');
const { getNumberBase, getInt, debugLog, getEnv } = require('../utilities');
const {
    handleError,
    checkObjectExistsInDB,
    createResponse,
    sendResponse,
    validateObjectId
} = require('./baseController');

const Artist = mongoose.model(getEnv('ARTIST_MODEL'));

const _fullUpdate = function(req, artist){
    artist.artistName   = req.body.artistName     
    artist.bornYear     = req.body.bornYear     
    artist.diedYear     = req.body.diedYear      
    artist.nation       = req.body.nation      
    artist.gender       = req.body.gender
    artist.bands        = req.body.bands
    artist.firstSong    = req.body.firstSong;
    artist.songs        = [];
}

const _partialUpdate = function(req, artist){
    //update found object with request parameters
    //update existing db object only if new value is coming from request 
    if (req.body.artistName) 
        artist.artistName   = req.body.artistName     
    if (req.body.bornYear) 
        artist.bornYear     = req.body.bornYear     
    if (req.body.diedYear) 
        artist.diedYear     = req.body.diedYear      
    if (req.body.nation) 
        artist.nation       = req.body.nation      
    if (req.body.gender) 
        artist.gender       = req.body.gender
    if (req.body.bands) 
        artist.bands        = req.body.bands
    if (req.body.firstSong) 
        artist.firstSong    = req.body.firstSong; 
}

const _updateToDB = function(req, artist, response, update){

    return new Promise((resolve, reject) => {
        update(req, artist);
        //update to database
        artist.save()
            .then((artist) => {
                checkObjectExistsInDB(artist, response);
                resolve();
            })
            .catch(error => {
                handleError(error, response);
                reject();
            });
    })
}

const _update = function(req, res, update){
    const artistId = req.params.artistId;
    //validate if provided artistId is valid document id
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }
    
    response = createResponse();
    Artist.findById(artistId)
        .then((artist) => checkObjectExistsInDB(artist, response))
        .then((artist) => _updateToDB(req, artist, response, update))
        .catch((error) => handleError(error, response))
        .finally(() => sendResponse(res, response));
}

const _runGeoSearchQuery = function(req, res, offset, count){

    let minDistance = parseFloat(getEnv('GEO_SEARCH_DEFAULT_MIN_DISTANCE'), getNumberBase());
    if(req.query && req.query.minDist){
        minDistance = parseFloat(req.query.minDist, getNumberBase());
    }

    let maxDistance = parseFloat(getEnv('GEO_SEARCH_DEFAULT_MAX_DISTANCE'), getNumberBase());
    if(req.query && req.query.maxDist){
        maxDistance = parseFloat(req.query.maxDist, getNumberBase());
    }

    const lng = parseFloat(req.query.lng, getNumberBase());
    const lat = parseFloat(req.query.lat, getNumberBase());

    // type check of the variables to be used
    if(isNaN(minDistance) || isNaN(maxDistance) || isNaN(lng) || isNaN(lat)){
        const response = createResponse(getEnv('CLIENT_ERROR_STATUS_CODE'), getEnv('PARAMETER_TYPE_ERROR_MESSAGE'));
        sendResponse(res, response);
        return;
    }

    const point = {type: "Point", coordinates: [lng, lat]};

    let query = {};
    if(req.query && req.query.search){
        query = {artistName: RegExp(req.query.search),
                "address.coordinates": {
                    $near: {
                        $geometry: point,
                        $maxDistance: maxDistance,
                        $minDistance: minDistance
                    }
        }}
    } else {
        //please check if this field is in index
        query = {"address.coordinates": {
            $near: {
                $geometry: point,
                $maxDistance: maxDistance,
                $minDistance: minDistance
            }
        }}
    }

    let response = createResponse();
    Artist.find(query).skip(offset).limit(count)
        .then((artists) => checkObjectExistsInDB(artists, response))
        .catch((error) => handleError(error, response))
        .finally(()=> sendResponse(res, response));
}

const getTotalCount = function(req, res) {
    debugLog("Get total count request received");

    let response = createResponse();
    Artist.find().count()
        .then((count) => checkObjectExistsInDB(count, response))
        .catch((error) => handleError(error, response))
        .finally(()=> sendResponse(res, response));
};

const getAll = function(req, res) {
    debugLog("Get all request received");

    //get value from environment variable
    let offset= getInt(getEnv('DEFAULT_OFFSET'));
    let count= getInt(getEnv('DEFAULT_COUNT'));
    let maxCount = getInt(getEnv('MAX_COUNT'));
    let filter = {};

    //check query string parameters
    if(req.query && req.query.offset){
        offset = getInt(req.query.offset);
    }
    if(req.query && req.query.count){
        count = getInt(req.query.count);
    }
    if(req.query && req.query.search){
        filter = {artistName: RegExp(req.query.search)};
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

    //handle geo search query on different method
    if(req.query && req.query.lat && req.query.lng){
        _runGeoSearchQuery(req, res, offset, count);
        return;
    }

    //initial response object
    let response = createResponse();

    //chained promise with named function can give the flat structure
    Artist.find(filter).skip(offset).limit(count)
        .then((artists) => checkObjectExistsInDB(artists, response))
        .catch((error) => handleError(error, response))
        .finally(()=> sendResponse(res, response));
}

const getOne = function(req, res) {
    debugLog("GET one artist Received", req.params);
    const artistId = req.params.artistId;

    //validate if provided artistId is valid document id
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }

    response = createResponse();
    Artist.findById(artistId)
        .then((artists) => checkObjectExistsInDB(artists, response))
        .catch((error) => handleError(error, response))
        .finally(()=> sendResponse(res, response));
};

const addOne = function(req, res) {
    debugLog("Add artist request received");
    const newArtist = { 
        artistName,
        bornYear,
        diedYear,
        nation,
        gender,
        bands,
        address,
        firstSong
    } = req.body;

    //initial response object
    let response = createResponse(getEnv('CREATE_SUCCESS_STATUS_CODE'));
    Artist.create(newArtist)
        .then((artists) => checkObjectExistsInDB(artists, response))
        .catch((error) => handleError(error, response))
        .finally(() => sendResponse(res, response));
};

const fullUpdate = function(req, res) {
    debugLog("Update artist request received");
    _update(req, res, _fullUpdate); 
};

const partialUpdate = function(req, res) {
    debugLog("Partial update artist request received");
    _update(req, res, _partialUpdate); 
};

const deleteOne = function(req, res) {
    debugLog("Delete artist request received");
    const artistId = req.params.artistId;

    //validate if provided artistId is valid document id
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }

    //initial response object
    response = createResponse(getEnv('UPDATE_SUCCESS_STATUS_CODE'));
    Artist.findByIdAndDelete(artistId)
        .then((artists) => checkObjectExistsInDB(artists, response))
        .catch((error) => handleError(error, response))
        .finally(() => sendResponse(res, response));
};

module.exports = {
    getTotalCount,
    getAll,
    getOne,
    addOne,
    fullUpdate,
    partialUpdate,
    deleteOne
}
