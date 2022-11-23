const debugLog = function(message){
    if(JSON.parse(getEnv('DEBUG_LOG'))){
        console.log(message);
    }
}

const getEnv = function(name){
    if(!name)
        return "";

    let result = process.env[name];
    if(!result)
        result = process.env[name.toUpperCase()];
    if(!result)
        result = process.env[name.toLowerCase()];
    if(!result){
        console.error(process.env.ENVIRONMENT_VARIABLE_MISSING_MESSAGE, name);
    }
    return result;
}

const getNumberBase = function(){
    return getEnv('NUMBER_BASE');
}

const getInt = function(num){
    return parseInt(num, getNumberBase());
}

module.exports = {
    debugLog,
    getNumberBase,
    getInt,
    getEnv
}