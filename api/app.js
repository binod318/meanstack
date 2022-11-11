const express = require('express');
require('dotenv').config();
require('./data/db')
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

//for FORM data POST processing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", (req, res, next) => {

    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Preflight");
    //res.header('Access-Control-Allow-Credentials', true);
    next();
})

app.use(express.static('public'));    

app.use('/api', routes);

const server = app.listen(port, function() {    
    console.log(process.env.SERVER_LISTEN_MESSAGE, server.address().port);
})


