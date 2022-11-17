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

const _updateAndSendResponse = function(res, artist){
    let response = createResponse(process.env.UPDATE_SUCCESS_STATUS_CODE);
    artist.save()
        .then(updatedArtist => response.message = updatedArtist)
        .catch(error => response = createErrorResponse(error))
        .finally(() => sendResponse(res, response));
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
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }

    //validate if provided songId is valid document id
    response = validateObjectId(songId);
    if(response){
        sendResponse(res, response);
        return;
    }

    response = createResponse(process.env.UPDATE_SUCCESS_STATUS_CODE);
    Artist.findById(artistId).select("songs").exec()
        .then(artist => {
            if(artist === null){
                response = createDbResponse();
                sendResponse(res, response);
            } else {
                //find song for given id
                let selectedSong = artist.songs.id(songId);

                //check if song exists for given id
                if(selectedSong === null){
                    response = createResponse(process.env.SERVER_ERROR_STATUS_CODE, process.env.INVALID_SONG_MESSAGE + songId);
                    sendResponse(res, response);
                } else {
                    update(req, selectedSong);
                    _updateAndSendResponse(res, artist);
                }
            }
        })
        .catch(error => {
            response = createErrorResponse(error);
            sendResponse(res, response);
        });

    // Artist.findById(artistId).select("songs").exec(function(err, artist){
        
    //     let response = _checkError(err);
    //     if(!response){
    //         response = _checkDbResponse(artist);
    //         if(response){
    //             _sendResponse(res, response);
    //         } else {
    //             //find song for given id
    //             let selectedSong = artist.songs.id(songId);

    //             //check if song exists for given id
    //             if(selectedSong === null){
    //                 response = {
    //                     status: process.env.SERVER_ERROR_STATUS_CODE,
    //                     message: process.env.INVALID_SONG_MESSAGE + songId
    //                 }
    //                 _sendResponse(res, response);
    //             } else {
    //                 update(req, selectedSong);
    //                 _updateAndSendResponse(res, artist);
    //             }
    //         }
    //     }
    // });
}

const _deleteSong = function(req, res, artist){
    const songId = req.params.songId;
    //remove document by id
    const song =artist.songs.id(songId)
    if(song) song.remove();

    _updateAndSendResponse(res, artist);
}

const getAll = function(req, res){
    const artistId = req.params.artistId;

    //get value from environment variable
    let offset=getInt(process.env.DEFAULT_OFFSET);
    let count= getInt(process.env.DEFAULT_COUNT);
    let maxCount = getInt(process.env.MAX_COUNT);

    //check query string parameters
    if(req.query && req.query.offset){
        offset = getInt(req.query.offset);
    }
    if(req.query && req.query.count){
        count = getInt(req.query.count);
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

    //validate if provided artistId is valid document id
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }

    response = createResponse();
    Artist.findById(artistId).select("songs").exec()
        .then(artist => {
            if(artist === null){
                response = createDbResponse();
            } else {
                //custom offset and limit implementation
                const filteredData = artist.songs.filter((val, index, arr) => {
                    if(index >= offset && index - offset < count ) 
                        return true;
                });
                response.message = filteredData;
            }
        })  
        .catch(error => response = createErrorResponse(error))
        .finally(() => sendResponse(res, response));

    // Artist.findById(artistId).select("songs").exec(function(err, artist) {
    //     //check error response
    //     let response = _checkError(err);
    //     if(!response){
    //         response = _checkDbResponse(artist);
    //         if(!response){
    //             //custom offset and limit implementation
    //             const filteredData = artist.songs.filter((val, index, arr) => {
    //                 if(index >= offset && index - offset < count ) 
    //                     return true;
    //             });
    //             response = {
    //                 status: process.env.OK_STATUS_CODE,
    //                 message: filteredData
    //             }
    //         }
    //     }

    //     //single termination point
    //     _sendResponse(res, response);
    // });
}

const getOne = function(req, res){
    const artistId = req.params.artistId;
    const songId = req.params.songId;

    //validate if provided artistId is valid document id
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }

    //validate if provided songId is valid document id
    response = validateObjectId(songId);
    if(response){
        sendResponse(res, response);
        return;
    }

    response = createResponse();
    Artist.findById(artistId).select("songs").exec()
        .then(artist => {
            if(artist === null){
                response = createDbResponse();
            } else {
                const selectedSong = artist.songs.id(songId); 
                if(selectedSong){
                    response.message = selectedSong;
                } else {
                    response = createResponse(process.env.FILE_NOT_FOUND_STATUS_CODE, process.env.INVALID_SONG_MESSAGE + songId);
                }
            }
        })
        .catch(error => response = createErrorResponse(error))
        .finally(() => sendResponse(res, response));

}

const addOne = function(req, res){
    console.log("Add song request received");
    const artistId = req.params.artistId;

    //validate if provided artistId is valid document id
    const response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }

    Artist.findById(artistId).select("songs").exec()
        .then(artist => {
            if(artist === null){
                response = createDbResponse();
                sendResponse(res, response);
            } else {
                _addSong(req, res, artist);
            }
        })
        .catch(error => {
            response = createErrorResponse(error);
            sendResponse(res, response)
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
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }

    //validate if provided songId is valid document id
    response = validateObjectId(songId);
    if(response){
        sendResponse(res, response);
        return;
    }

    Artist.findById(artistId).select("songs").exec()
        .then(artist => {
            if(artist === null){
                response = createDbResponse();
                sendResponse(res, response);
            } else {
                _deleteSong(req, res, artist);
            }
        })
        .catch(error => response = createErrorResponse(error));

    // Artist.findById(artistId).select("songs").exec(function(err, artist){

    //     let response = _checkError(err);
    //     if(!response){
    //         response = _checkDbResponse(artist);
    //         if(response){
    //             _sendResponse(res, response);
    //         } else {
    //             _deleteSong(req, res, artist);
    //         }
    //     }
    // });
}

module.exports = {
    getAll,
    getOne,
    addOne,
    fullUpdate,
    partialUpdate,
    deleteOne
};
