const mongoose = require('mongoose');
const { getInt, debugLog, getEnv } = require('../utilities');
const {
    handleError,
    checkObjectExistsInDB,
    createResponse,
    sendResponse,
    validateObjectId
} = require('./baseController');

const Artist = mongoose.model(getEnv('ARTIST_MODEL'));

const _updateToDB = function(artist, response){

    return new Promise((resolve, reject) => {
        artist.save()
            .then((updatedArtist) => {
                checkObjectExistsInDB(updatedArtist, response);
                resolve();
            })
            .catch((error) => {
                handleError(error, response);
                reject();
            });
    })
}

const _addSong = function(req, artist, response){
    const song = {
        title,
        rank,
        year,
        album
    } = req.body;

    artist.songs.push(song);
    _updateToDB(artist, response);
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

const _handleUpdate = function(req, artist, songId, response, update){
    //find song for given id
    let selectedSong = artist.songs.id(songId);

    //check if song exists for given id
    if(selectedSong === null){
        response.status = getEnv('SERVER_ERROR_STATUS_CODE');
        response.message = getEnv('INVALID_SONG_MESSAGE') + songId;
    } else {
        update(req, selectedSong);
        _updateToDB(artist, response);
    }
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

    response = createResponse(getEnv('UPDATE_SUCCESS_STATUS_CODE'));
    Artist.findById(artistId).select("songs")
        .then((artist) => checkObjectExistsInDB(artist, response))
        .then((artist) => _handleUpdate(req, artist, songId, response, update))
        .catch((error) => handleError(error, response))
        .finally(() => sendResponse(res, response));
}

const _deleteSong = function(req, artist, response){
    const songId = req.params.songId;
    //remove document by id
    const song =artist.songs.id(songId)
    if(song) song.remove();

    _updateToDB(artist, response);
}

const _returnAllFilteredSongs = function(offset, count, artist, response){
    //custom offset and limit implementation
    const filteredData = artist.songs.filter((val, index, arr) => {
        if(index >= offset && index - offset < count ) 
            return true;
    });
    response.message = filteredData;
}

const _returnOneSong = function(artist, songId, response){
    const selectedSong = artist.songs.id(songId); 
    if(selectedSong){
        response.message = selectedSong;
    } else {
        response.status = getEnv('FILE_NOT_FOUND_STATUS_CODE');
        response.message = getEnv('INVALID_SONG_MESSAGE') + songId;
    }
}

const getAll = function(req, res){
    debugLog('Get all song request received', req.params, req.query);
    const artistId = req.params.artistId;

    //get value from environment variable
    let offset = getInt(getEnv('DEFAULT_OFFSET'));
    let count = getInt(getEnv('DEFAULT_COUNT'));
    let maxCount = getInt(getEnv('MAX_COUNT'));

    //check query string parameters
    if(req.query && req.query.offset){
        offset = getInt(req.query.offset);
    }
    if(req.query && req.query.count){
        count = getInt(req.query.count);
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

    //validate if provided artistId is valid document id
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }

    response = createResponse();
    Artist.findById(artistId).select("songs")
        .then((artist) => checkObjectExistsInDB(artist, response))
        .then((artist) => _returnAllFilteredSongs(offset, count, artist, response))
        .catch((error) => handleError(error, response))
        .finally(() => sendResponse(res, response));

}

const getOne = function(req, res){
    debugLog('Get one song request received', req.query);
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
    Artist.findById(artistId).select("songs")
        .then((artist) => checkObjectExistsInDB(artist, response))
        .then((artist) => _returnOneSong(artist, songId, response))
        .catch((error) => handleError(error, response))
        .finally(() => sendResponse(res, response));
}

const addOne = function(req, res){
    debugLog("Add song request received");
    const artistId = req.params.artistId;

    //validate if provided artistId is valid document id
    let response = validateObjectId(artistId);
    if(response){
        sendResponse(res, response);
        return;
    }

    response = createResponse(getEnv('UPDATE_SUCCESS_STATUS_CODE'));
    Artist.findById(artistId).select("songs")
        .then((artist) => checkObjectExistsInDB(artist, response))
        .then((artist) => _addSong(req, artist, response))
        .catch(error => handleError(error, response))
        .finally(() => sendResponse(res, response));
}
    
const fullUpdate = function(req, res){
    debugLog("Full update song request received");
    _update(req, res, _fullUpdateSong);
}

const partialUpdate = function(req, res){
    debugLog("Partial update song request received");
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

    response = createResponse(getEnv('UPDATE_SUCCESS_STATUS_CODE'));
    Artist.findById(artistId).select("songs")
        .then((artist) => checkObjectExistsInDB(artist, response))
        .then((artist) => _deleteSong(req, artist, response))
        .catch(error => handleError(error, response))
        .finally(() => sendResponse(res, response));

}

module.exports = {
    getAll,
    getOne,
    addOne,
    fullUpdate,
    partialUpdate,
    deleteOne
};
