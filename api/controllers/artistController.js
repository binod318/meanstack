const mongoose = require('mongoose');
const {
    getInt,
    createResponse,
    createErrorResponse,
    createDbResponse,
    sendResponse,
    validateObjectId
} = require('./baseController');

const Artist = mongoose.model(process.env.ARTIST_MODEL);

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

const _update = function(req, res, update){
    const artistId = req.params.artistId;
    //validate if provided artistId is valid document id
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }
    
    Artist.findById(artistId).exec()
        .then(artist => {
            if(artist === null){
                response = createDbResponse();
                sendResponse(res, response);
            } else {
                response = createResponse(process.env.UPDATE_SUCCESS_STATUS_CODE, artist);
                update(req, artist);

                //update to database
                artist.save()
                    .then(updatedArtist => response.message = updatedArtist)
                    .catch(error => response = createErrorResponse(error))
                    .finally(() => {
                        sendResponse(res, response);
                    });
            }
        })
        .catch(error => {
            response = createErrorResponse(error);
            sendResponse(res, response);
        });
}

const _runGeoSearchQuery = function(req, res, offset, count){

    let minDistance = parseFloat(process.env.GEO_SEARCH_DEFAULT_MIN_DISTANCE, process.env.NUMBER_BASE);
    if(req.query && req.query.minDist){
        minDistance = parseFloat(req.query.minDist, process.env.NUMBER_BASE);
    }

    let maxDistance = parseFloat(process.env.GEO_SEARCH_DEFAULT_MAX_DISTANCE, process.env.NUMBER_BASE);
    if(req.query && req.query.maxDist){
        maxDistance = parseFloat(req.query.maxDist, process.env.NUMBER_BASE);
    }

    const lng = parseFloat(req.query.lng, process.env.NUMBER_BASE);
    const lat = parseFloat(req.query.lat, process.env.NUMBER_BASE);

    // type check of the variables to be used
    if(isNaN(minDistance) || isNaN(maxDistance) || isNaN(lng) || isNaN(lat)){
        const response = createResponse(process.env.CLIENT_ERROR_STATUS_CODE, process.env.PARAMETER_TYPE_ERROR_MESSAGE);
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

    Artist.find(query).skip(offset).limit(count).exec()
        .then(artists => response.message = artists)
        .catch(err => response = createErrorResponse(err))
        .finally(()=> sendResponse(res, response));

}

const getTotalCount = function(req, res) {
    console.log("Get total count request received");

    let response = createResponse();
    Artist.find().count()
        .then(count => response.message = count )
        .catch(err => response = createErrorResponse(err))
        .finally(() => sendResponse(res, response));

};

const getAll = function(req, res) {
    console.log("Get all request received");

    //get value from environment variable
    let offset=getInt(process.env.DEFAULT_OFFSET);
    let count= getInt(process.env.DEFAULT_COUNT);
    let maxCount = getInt(process.env.MAX_COUNT);
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
        const response = createResponse(process.env.CLIENT_ERROR_STATUS_CODE, process.env.PARAMETER_TYPE_ERROR_MESSAGE);
        sendResponse(res, response);
        return;
    }

    //limit check
    if(count > maxCount){
        const response = createResponse(process.env.CLIENT_ERROR_STATUS_CODE, process.env.LIMIT_EXCEED_MESSAGE);
        sendResponse(res, response);
        return;
    }

    if(req.query && req.query.lat && req.query.lng){
        _runGeoSearchQuery(req, res, offset, count);
        return;
    }

    //initial response object
    let response = createResponse();

    Artist.find(filter).skip(offset).limit(count).exec()
        .then(artists => response.message = artists)
        .catch(err => response = createErrorResponse(err))
        .finally(()=> sendResponse(res, response));
}

const getOne = function(req, res) {
    console.log("GET One Received");
    const artistId = req.params.artistId;

    //validate if provided artistId is valid document id
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }

    response = createResponse();
    Artist.findById(artistId).exec()
        .then(artist => {
            if(artist === null){
                response = createDbResponse();
            } else {
                response.message = artist
            }
        })
        .catch(error => response = createErrorResponse(error))
        .finally(()=> sendResponse(res, response));
};

const addOne = function(req, res) {
    console.log("Add artist request received");
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
    let response = createResponse(process.env.CREATE_SUCCESS_STATUS_CODE);

    Artist.create(newArtist)
        .then(artist => response.message = artist)
        .catch(error => response = createErrorResponse(error))
        .finally(() => sendResponse(res, response));
};

const fullUpdate = function(req, res) {
    console.log("Update artist request received");
    _update(req, res, _fullUpdate); 
};

const partialUpdate = function(req, res) {
    console.log("Partial update artist request received");
    _update(req, res, _partialUpdate); 
};

const deleteOne = function(req, res) {
    console.log("Delete artist request received");
    const artistId = req.params.artistId;

    //validate if provided artistId is valid document id
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }

    //initial response object
    response = createResponse(process.env.CREATE_SUCCESS_STATUS_CODE);
    Artist.findByIdAndDelete(artistId).exec()
        .then(artist => {
            if(artist === null){
                response = createDbResponse();
            } else {
                response.message = artist
            }
        })
        .catch(error => response = createErrorResponse(error))
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
