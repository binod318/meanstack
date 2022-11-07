const mongoose = require('mongoose');

const Artist = mongoose.model(process.env.ARTIST_MODEL);

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
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: artists
        }

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        }

        //single termination point
        res.status(parseInt(response.status, process.env.NUMBER_BASE)).send(response.message);

    });
};
const getOne = function(req, res) {
    console.log("GET One Received");
    const artistId = req.params.artistId;

    //check parameter type
    const validArtistId = mongoose.isValidObjectId(artistId);
    if(!validArtistId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE});
        return;
    }

    Artist.findById(artistId).exec(function(err, artist){
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: artist
        };

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        } else if(artist === null){ //check response object
            response.status = process.env.FILE_NOT_FOUND_STATUS_CODE;
            response.message = process.env.INVALID_IDENTIFIER_MESSAGE;  
        }

        //single termination points
        res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
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
        const response = {
            status: process.env.CREATE_SUCCESS_STATUS_CODE,
            message: artist
        };

        //check error response
        if(err){
            response.status = process.env.SERVER_ERROR_STATUS_CODE;
            response.message = err;
        }
        
        //single termination point
        res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
    });
};

const updateOne = function(req, res) {
    console.log("Update artist request received");
    const artistId = req.params.artistId;

    //check parameter type
    const validArtistId = mongoose.isValidObjectId(artistId);
    if(!validArtistId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE});
        return;
    }

    Artist.findById(artistId).exec(function(err, artist){

        //check error response
        if(err){ 
            res.status(parseInt(process.env.SERVER_ERROR_STATUS_CODE)).json(err);
            return;
        } 

        //check object response
        if(artist === null){ 
            res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_IDENTIFIER_MESSAGE});
            return;
        } 

        //update found object with request parameters
        artist.artistName   = req.body.artistName     
        artist.bornYear     = req.body.bornYear     
        artist.diedYear     = req.body.diedYear      
        artist.nation       = req.body.nation      
        artist.gender       = req.body.gender
        artist.bands        = req.body.bands
        artist.firstSong    = req.body.firstSong;

        //save updated object to database
        artist.save(function(err, updatedArtist){
            const response = {
                status: process.env.OK_STATUS_CODE,
                message: updatedArtist
            };
    
            //check error response
            if(err){ 
                response.status = process.env.SERVER_ERROR_STATUS_CODE; 
                response.message = err;
            } 
    
            //single termination points
            res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
        })
    });  
};

const partialUpdateOne = function(req, res) {
    console.log("Partial update artist request received");
    const artistId = req.params.artistId;

    //check parameter type
    const validArtistId = mongoose.isValidObjectId(artistId);
    if(!validArtistId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE});
        return;
    }

    Artist.findById(artistId).exec(function(err, artist){

        //check error response
        if(err){ 
            res.status(parseInt(process.env.SERVER_ERROR_STATUS_CODE)).json(err);
            return;
        } 

        if(artist === null){ 
            res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_IDENTIFIER_MESSAGE});
            return;
        } 

        //update found object with request parameters
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

        //save updated object to database
        artist.save(function(err, updatedArtist){
            const response = {
                status: process.env.OK_STATUS_CODE,
                message: updatedArtist
            };
    
            //check error response
            if(err){ 
                response.status = process.env.SERVER_ERROR_STATUS_CODE; 
                response.message = err;
            } 
    
            //single termination points
            res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
        })
    }); 
};

const deleteOne = function(req, res) {
    console.log("Delete artist request received");
    const artistId = req.params.artistId;

    //check if id provided is valid document objectid type
    const validArtistId = mongoose.isValidObjectId(artistId)
    if(!validArtistId){
        res.status(parseInt(process.env.FILE_NOT_FOUND_STATUS_CODE)).json({message: process.env.INVALID_DOCUMENT_OBJECT_ID_MESSAGE});
        return;
    }

    Artist.findByIdAndDelete(artistId).exec(function(err, artist){
        const response = {
            status: process.env.OK_STATUS_CODE,
            message: artist
        };

        //check error response
        if(err){ 
            response.status = process.env.SERVER_ERROR_STATUS_CODE; 
            response.message = err;
        } 

        //single termination points
        res.status(parseInt(response.status, process.env.NUMBER_BASE)).json(response.message);
    })
};

module.exports = {
  getAll,
  getOne,
  addOne,
  updateOne,
  partialUpdateOne,
  deleteOne
}
