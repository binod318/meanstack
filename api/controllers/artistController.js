const mongoose = require('mongoose');

const Artist = mongoose.model(process.env.ARTIST_MODEL);

//private methods

const _sendResponse = function(res, response){
    res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
}

//check if id provided is valid document objectid type
const _validateObjectId = function(id){
    const validObjectId = mongoose.isValidObjectId(id);
    if(!validObjectId){
        const response = {
            status: process.env.FILE_NOT_FOUND_STATUS_CODE,
            message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE
        };
        return response;
    }
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

const _updateAndSendResponse = function(res, artist){
    //save updated object to database
    artist.save(function(err, updatedArtist){
        //check error response
        let response = _checkError(err);
        if(!response){
            response = {
                status: process.env.UPDATE_SUCCESS_STATUS_CODE,
                message: updatedArtist
            };
        }
        _sendResponse(res, response);
    })
}

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
    const response = _validateObjectId(artistId);
    if(response){
        _sendResponse(res, response);
        return;
    }
    Artist.findById(artistId).exec(function(err, artist){
        let response = _checkError(err);
        if(!response){
            response = _checkDbResponse(artist);
            if(response){
                _sendResponse(res, response);
            } else {
                update(req, artist);
                _updateAndSendResponse(res, artist);
            }
        }
    }); 
}

const getAll = function(req, res) {
    console.log("Get all request received");

    //get value from environment variable
    let offset=parseInt(process.env.DEFAULT_OFFSET, process.env.NUMBER_BASE);
    let count= parseInt(process.env.DEFAULT_COUNT, process.env.NUMBER_BASE);
    let maxCount = parseInt(process.env.MAX_COUNT, process.env.NUMBER_BASE);

    //check query string parameters
    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset, process.env.NUMBER_BASE);
    }
    if(req.query && req.query.count){
        count = parseInt(req.query.count, process.env.NUMBER_BASE);
    }

    // type check of the variables to be used
    if(isNaN(offset) || isNaN(count)){
        res.status(parseInt(process.env.CLIENT_ERROR_STATUS_CODE)).json({message: process.env.PARAMETER_TYPE_ERROR_MESSAGE});
        return;
    }

    //limit check
    if(count > maxCount){
        res.status(parseInt(process.env.CLIENT_ERROR_STATUS_CODE)).json({message: process.env.LIMIT_EXCEED_MESSAGE + maxCount});
        return;
    }

    Artist.find().skip(offset).limit(count).exec(function(err, artists) {
        //check error response
        let response = _checkError(err);
        if(!response){
            response = {
                status: process.env.OK_STATUS_CODE,
                message: artists
            }
        }

        _sendResponse(res, response);
    });
};
const getOne = function(req, res) {
    console.log("GET One Received");
    const artistId = req.params.artistId;

    //validate if provided artistId is valid document id
    const response = _validateObjectId(artistId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    Artist.findById(artistId).exec(function(err, artist){
        //check error response
        let response = _checkError(err);
        if(!response){
            response = _checkDbResponse(artist);
            if(!response){
                response = {
                    status: process.env.OK_STATUS_CODE,
                    message: artist
                }
            }
        }

        //single termination points
        _sendResponse(res, response);
    });
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
        firstSong
    } = req.body;

    Artist.create(newArtist, function(err, artist){
        //check error response
        let response = _checkError(err);
        if(!response){
            response = {
                status: process.env.CREATE_SUCCESS_STATUS_CODE,
                message: artist
            }
        }

        _sendResponse(res, response);
    });
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
    const response = _validateObjectId(artistId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    Artist.findByIdAndDelete(artistId).exec(function(err, artist){
        //check error response
        let response = _checkError(err);
        if(!response){
            response = {
                status: process.env.UPDATE_SUCCESS_STATUS_CODE,
                message: artist
            }
        }

        _sendResponse(res, response);
    })
};

module.exports = {
  getAll,
  getOne,
  addOne,
  fullUpdate,
  partialUpdate,
  deleteOne
}
