const mongoose = require('mongoose');

const Artist = mongoose.model(process.env.ARTIST_MODEL);

const _sendResponse = function(res, response){
    res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
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
    artist.save(function(err, updatedArtist){
        //check error response
        let response = _checkError(err);
        if(!response){
            response = {
                status: process.env.UPDATE_SUCCESS_STATUS_CODE,
                message: updatedArtist
            };
        }

        //single termination point
        _sendResponse(res, response);
    });
}

const _addSong = function(req, res, artist){
    const song = {
        title,
        rank,
        year,
        album
    } = req.body;

    artist.songs.push(song);
    _updateAndSendResponse(res, artist);
}

const _fullUpdateSong = function(req, song){
    song.title = req.body.title;
    song.rank = req.body.rank;
    song.year = req.body.year;
    song.album = req.body.album;
}

const _partialUpdateSong = function(req, song){
    if(req.body.title) song.title = req.body.title;
    if(req.body.rank) song.rank = req.body.rank;
    if(req.body.year) song.year = req.body.year;
    if(req.body.album) song.album = req.body.album;
}

const _update = function(req, res, update){
    const artistId = req.params.artistId;
    const songId = req.params.songId;

    //validate if provided artistId is valid document id
    let response = _validateObjectId(artistId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    //validate if provided songId is valid document id
    response = _validateObjectId(songId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    Artist.findById(artistId).select("songs").exec(function(err, artist){
        
        let response = _checkError(err);
        if(!response){
            response = _checkDbResponse(artist);
            if(response){
                _sendResponse(res, response);
            } else {
                //find song for given id
                let selectedSong = artist.songs.id(songId);

                //check if song exists for given id
                if(selectedSong === null){
                    response = {
                        status: process.env.SERVER_ERROR_STATUS_CODE,
                        message: process.env.INVALID_SONG_MESSAGE + songId
                    }
                    _sendResponse(res, response);
                } else {
                    update(req, selectedSong);
                    _updateAndSendResponse(res, artist);
                }
            }
        }
    });
}

const _deleteSong = function(req, res, artist){
    const songId = req.params.songId;
    //remove document by id
    const song =artist.songs.id(songId)
    if(song)
        song.remove();

    _updateAndSendResponse(res, artist);
}

const getAll = function(req, res){
    const artistId = req.params.artistId;

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

    //validate if provided artistId is valid document id
    const response = _validateObjectId(artistId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    Artist.findById(artistId).select("songs").exec(function(err, artist) {
        //check error response
        let response = _checkError(err);
        if(!response){
            response = _checkDbResponse(artist);
            if(!response){
                //custom offset and limit implementation
                const filteredData = artist.songs.filter((val, index, arr) => {
                    if(index >= offset && index - offset < count ) 
                        return true;
                });
                response = {
                    status: process.env.OK_STATUS_CODE,
                    message: filteredData
                }
            }
        }

        //single termination point
        _sendResponse(res, response);
    });
}

const getOne = function(req, res){
    const artistId = req.params.artistId;
    const songId = req.params.songId;

    //validate if provided artistId is valid document id
    let response = _validateObjectId(artistId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    //validate if provided songId is valid document id
    response = _validateObjectId(songId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    Artist.findById(artistId).select("songs").exec(function(err, artist) {

        //check error response
        let response = _checkError(err);
        if(!response){
            response = _checkDbResponse(artist);
            if(!response){
                const selectedSong = artist.songs.id(songId); 
                if(selectedSong){
                    response = {
                        status: process.env.OK_STATUS_CODE,
                        message: selectedSong
                    }
                } else {
                    response = {
                        status : process.env.FILE_NOT_FOUND_STATUS_CODE,
                        message : process.env.INVALID_SONG_MESSAGE + songId
                    }
                }
            }
        }

        //single termination point
        _sendResponse(res, response);
    });
}

const addOne = function(req, res){
    console.log("Add song request received");
    const artistId = req.params.artistId;

    //validate if provided artistId is valid document id
    const response = _validateObjectId(artistId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    Artist.findById(artistId).select("songs").exec(function(err, artist){
        let response = _checkError(err);
        if(!response){
            response = _checkDbResponse(artist);
            if(response){
                _sendResponse(res, response);
            } else {
                _addSong(req, res, artist);
            }
        }
    });
}
    
const fullUpdate = function(req, res){
    console.log("Full update song request received");
    _update(req, res, _fullUpdateSong);
}

const partialUpdate = function(req, res){
    console.log("Partial update song request received");
    _update(req, res, _partialUpdateSong);
}
    
const deleteOne = function(req, res){
    console.log("Delete song request received");
    const artistId = req.params.artistId;
    const songId = req.params.songId;

    //validate if provided artistId is valid document id
    let response = _validateObjectId(artistId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    //validate if provided songId is valid document id
    response = _validateObjectId(songId);
    if(response){
        _sendResponse(res, response);
        return;
    }

    Artist.findById(artistId).select("songs").exec(function(err, artist){

        let response = _checkError(err);
        if(!response){
            response = _checkDbResponse(artist);
            if(response){
                _sendResponse(res, response);
            } else {
                _deleteSong(req, res, artist);
            }
        }
    });
}

module.exports = {
    getAll,
    getOne,
    addOne,
    fullUpdate,
    partialUpdate,
    deleteOne
};
