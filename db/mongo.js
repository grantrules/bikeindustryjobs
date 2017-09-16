var mongoose = require('mongoose');
var config = require('../config');

module.exports = (server) => {
    mongoose.connect(config.mongodb);
    
    mongoose.connection.on('connected',function () {  
        console.log('Mongoose default connected');
        server.startServer()
    });
    
    mongoose.connection.on('error',function (err) {  
        console.log('Mongoose default connection error: ' + err);
        server.error(err);
    });
    
    mongoose.connection.on('disconnected', function () {  
        console.log('Mongoose default connection disconnected'); 
        server.stopServer()
    });

    return mongoose;
}