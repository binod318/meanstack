const express = require('express');
const { getEnv } = require('./api/utilities');
require('dotenv').config();
require('./api/data/db')
const routes = require('./api/routes');

const app = express();
const port = getEnv('PORT');

//this middleware is needed for http body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", (req, res, next) => {

    res.header("Access-Control-Allow-Origin", getEnv('CORS_ALLOW_ORIGINS'));
    res.header("Access-Control-Allow-Methods", getEnv('CORS_ALLOW_METHODS'));
    res.header("Access-Control-Allow-Headers", getEnv('CORS_ALLOW_HEADERS'));
    next();
})

app.use(express.static(getEnv('PUBLIC_FOLDER')));    

app.use('/api', routes);

const server = app.listen(port, function() {    
    console.log(getEnv('SERVER_LISTEN_MESSAGE'), server.address().port);
})


