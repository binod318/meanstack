const mongoose = require('mongoose');

const Artist = mongoose.model(process.env.ARTIST_MODEL);

const _addSong = function(req, res, artist){
    const song = {
        title,
        rank,
        year,
        album
    } = req.body;

    artist.songs.push(song);

    artist.save(function(err, updatedArtist){
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: ""
        }

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        } else {
            response.status = process.env.CREATE_SUCCESS_STATUS_CODE;
            response.message = updatedArtist.songs[updatedArtist.songs.length - 1];  
        }

        //single termination point
        res.status(parseInt(response.status, process.env.NUMBER_BASE)).json({message: response.message});
    });
}

const _updateSong = function(req, res, artist){
    const songId = req.params.songId;

    let selectedSong = artist.songs.id(songId);

    //check is song document exist for given id
    if(selectedSong === null){
        res.status(parseInt(process.env.SERVER_ERROR_STATUS_CODE, process.env.NUMBER_BASE)).json(process.env.INVALID_SONG_MESSAGE + songId);
        return;
    }

    //update object
    selectedSong.title = req.body.title;
    selectedSong.rank = req.body.rank;
    selectedSong.year = req.body.year;
    selectedSong.album = req.body.album;

    artist.save(function(err, updatedArtist){
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: ""
        }

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        } else {
            response.message = updatedArtist.songs.id(songId);  
        }

        //single termination point
        res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
    });
}

const _partialUpdateSong = function(req, res, artist){
    const songId = req.params.songId;

    //find song for given id
    let selectedSong = artist.songs.id(songId);

    //check if song exists for given id
    if(selectedSong === null){
        res.status(parseInt(process.env.SERVER_ERROR_STATUS_CODE, process.env.NUMBER_BASE)).json(process.env.INVALID_SONG_MESSAGE + songId);
        return;
    }

    //update object
    if(req.body.title) selectedSong.title = req.body.title;
    if(req.body.rank) selectedSong.rank = req.body.rank;
    if(req.body.year) selectedSong.year = req.body.year;
    if(req.body.album) selectedSong.album = req.body.album;

    artist.save(function(err, updatedArtist){
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: ""
        }

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        } else {
            response.message = updatedArtist.songs.id(songId);  
        }

        //single termination point
        res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
    });
}

const _deleteSong = function(req, res, artist){
    const songId = req.params.songId;

    //remove document by id
    artist.songs.id(songId).remove();

    artist.save(function(err, updatedArtist){
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: ""
        }

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        } else {
            response.message = updatedArtist.songs;  
        }

        //single termination point
        res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
    });
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

    //check if the id is valid document object id
    const validArtistId = mongoose.isValidObjectId(artistId);
    if(!validArtistId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE});
        return;
    }

    Artist.findById(artistId).select("songs").exec(function(err, artist) {
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: []
        }

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        } else if(artist === null){ //check if artist exists with given id
            response.status = process.env.FILE_NOT_FOUND_STATUS_CODE;
            response.message = process.env.INVALID_ARTIST_MESSAGE + artistId;  
        } else {
            //custom offset and limit implementation
            const filteredData = artist.songs.filter((val, index, arr) => {
                if(index >= offset && index - offset < count ) 
                    return true;
            });
            response.message = filteredData;  
        }

        //single termination point
        res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
    });
}

const getOne = function(req, res){
    const artistId = req.params.artistId;
    const songId = req.params.songId;

    //check if the id is valid document id
    const validArtistId = mongoose.isValidObjectId(artistId);
    if(!validArtistId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE + artistId});
        return;
    }

    const validSongId = mongoose.isValidObjectId(songId);
    if(!validSongId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE + songId});
        return;
    }

    Artist.findById(artistId).select("songs").exec(function(err, artist) {
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: []
        }

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        } else if(artist === null){
            response.status = process.env.FILE_NOT_FOUND_STATUS_CODE;
            response.message = process.env.INVALID_ARTIST_MESSAGE + artistId;  
        } else {
            const selectedSong = artist.songs.id(songId); 
            if(selectedSong)
                response.message = selectedSong; 
            else {
                response.status = process.env.FILE_NOT_FOUND_STATUS_CODE;
                response.message = process.env.INVALID_SONG_MESSAGE + songId; 
            }
        }

        //single termination point
        res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
    });
}

const create = function(req, res){
    console.log("Add song request received");
    const artistId = req.params.artistId;

    //check if the id passed is valid document id
    const validArtistId = mongoose.isValidObjectId(artistId);
    if(!validArtistId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE + artistId});
        return;
    }

    Artist.findById(artistId).select("songs").exec(function(err, artist){
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: artist
        };

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        } else if(artist === null){ //check object response
            response.status = process.env.FILE_NOT_FOUND_STATUS_CODE;
            response.message = process.env.INVALID_ARTIST_MESSAGE + artistId;
        }
        
        if(artist){
            _addSong(req, res, artist);
        } else {
            res.status(parseInt(response.status, process.env.NUMBER_BASE)).json({message: response.message});
        }
    });
}
    
const update = function(req, res){
    console.log("Update song request received");
    const artistId = req.params.artistId;
    const songId = req.params.songId;

    //check if the id is valid document object id
    const validArtistId = mongoose.isValidObjectId(artistId);
    if(!validArtistId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE + artistId});
        return;
    }
    //check if the id is valid document object id
    const validSongId = mongoose.isValidObjectId(songId);
    if(!validSongId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE + songId});
        return;
    }

    Artist.findById(artistId).select("songs").exec(function(err, artist){
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: artist
        };

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        } else if(artist === null){ //check object response
            response.status = process.env.FILE_NOT_FOUND_STATUS_CODE;
            response.message = process.env.INVALID_ARTIST_MESSAGE + artistId;
        }
        
        //only update sub document if main document exists
        if(artist){
            _updateSong(req, res, artist);
        } else {
            res.status(parseInt(response.status, process.env.NUMBER_BASE)).json({message: response.message});
        }
    });
}

const partialUpdate = function(req, res){
    console.log("Partial update song request received");
    const artistId = req.params.artistId;
    const songId = req.params.songId;

    //check if the id is valid document object id
    const validArtistId = mongoose.isValidObjectId(artistId);
    if(!validArtistId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE + artistId});
        return;
    }
    //check if the id is valid document object id
    const validSongId = mongoose.isValidObjectId(songId);
    if(!validSongId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE + songId});
        return;
    }

    Artist.findById(artistId).select("songs").exec(function(err, artist){
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: artist
        };

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        } else if(artist === null){ //check object response
            response.status = process.env.FILE_NOT_FOUND_STATUS_CODE;
            response.message = process.env.INVALID_ARTIST_MESSAGE + artistId;
        }
        
        //only update sub document if main document exists
        if(artist){
            _partialUpdateSong(req, res, artist);
        } else {
            res.status(parseInt(response.status, process.env.NUMBER_BASE)).json({message: response.message});
        }
    });
}
    
const remove = function(req, res){
    console.log("Delete song request received");
    const artistId = req.params.artistId;
    const songId = req.params.songId;

    //check if the id is valid document object id
    const validArtistId = mongoose.isValidObjectId(artistId);
    if(!validArtistId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE + artistId});
        return;
    }

    //check if the id is valid document object id
    const validSongId = mongoose.isValidObjectId(songId);
    if(!validSongId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE + songId});
        return;
    }

    Artist.findById(artistId).select("songs").exec(function(err, artist){
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: artist
        };

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        } else if(artist === null){ //check object response
            response.status = process.env.FILE_NOT_FOUND_STATUS_CODE;
            response.message = process.env.INVALID_ARTIST_MESSAGE + artistId;
        }
        
        //delete sub document only if main document exists
        if(artist){
            _deleteSong(req, res, artist);
        } else {
            res.status(parseInt(response.status, process.env.NUMBER_BASE)).json({message: response.message});
        }
    });
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    partialUpdate,
    remove
};
