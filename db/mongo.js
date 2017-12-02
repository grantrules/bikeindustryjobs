var mongoose = require('mongoose');
var log = require('loglevel');
var config = require('../config');

module.exports = (server) => {
    mongoose.connect(config.mongodb);
    
    mongoose.connection.on('connected',function () {  
        log.info('Mongoose default connected');
        server.startServer()
    });
    
    mongoose.connection.on('error',function (err) {  
        log.error('Mongoose default connection error: ' + err);
        server.error(err);
    });
    
    mongoose.connection.on('disconnected', function () {  
        log.info('Mongoose default connection disconnected'); 
        server.stopServer()
    });

    return mongoose;
}