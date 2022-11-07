const mongoose = require('mongoose');
require('./artist-model');
mongoose.connect(process.env.DB_URL);

mongoose.connection.on("connected", function(){
    console.log(process.env.MONGOOSE_CONNECTED_MESSAGE);
});

mongoose.connection.on("disconnected", function(){
    console.log(process.env.MONGOOSE_DISCONNECTED_MESSAGE);
});

mongoose.connection.on("error", function(){
    console.log(process.env.MONGOOSE_ERROR_MESSAGE);
});

process.once("SIGUSR2", function(){
    mongoose.connection.close(function(){
        console.log(process.env.MONGOOSE_SIGUSR2_MESSAGE);
        process.kill(process.pid, "SIGUSR2");
    });
})

process.on("SIGHUP", function(){
    mongoose.connection.close(function(){
        process.kill(process.pid, "SIGUSR2");
    });
});