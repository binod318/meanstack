const debugLog = function(message){
    if(JSON.parse(process.env.DEBUG_LOG)){
        console.log(message);
    }
}

const getInt = function(num){
    return parseInt(num, process.env.NUMBER_BASE);
}

module.exports = {
    debugLog,
    getInt
}