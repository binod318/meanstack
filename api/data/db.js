const mongoose = require('mongoose');
const { getEnv } = require('../utilities');
require('./artist-model');
require('./user-model')
mongoose.connect(getEnv('DB_URL') + getEnv('DB_NAME'));

mongoose.connection.on("connected", function(){
    console.log(getEnv('MONGOOSE_CONNECTED_MESSAGE'));
});

mongoose.connection.on("disconnected", function(){
    console.log(getEnv('MONGOOSE_DISCONNECTED_MESSAGE'));
});

mongoose.connection.on("error", function(){
    console.log(getEnv('MONGOOSE_ERROR_MESSAGE'));
});


process.on("SIGINT", function(){
    mongoose.connection.close(function(){
        process.exit(0);
    });
});

process.on("SIGTERM", function(){
    mongoose.connection.close(function(){
        process.exit(0);
    });
});

process.once("SIGUSR2", function(){
    mongoose.connection.close(function(){
        process.kill(process.pid, "SIGUSR2");
    });
})

process.on("SIGHUP", function(){
    mongoose.connection.close(function(){
        process.kill(process.pid, "SIGUSR2");
    });
});