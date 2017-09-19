var config = require('./config');
var log = require('loglevel');

var express = require('express');
var bodyParser = require('body-parser');

var mongo = require('./db/mongo')

var routes = require('./routes/routes');
var passport = require('./auth/passport');

log.enableAll();

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// CORS stuff, only needed for dev
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

passport(app);

routes(app);

var server = function(app) {
    this.app = app;
    this.server = null;
    this.startServer = () => this.server = this.app.listen(9004);
    this.stopServer = () => this.server.close();
    this.error = (err) => log.error(err);
}

var mongoose = mongo(new server(app));


process.on( 'SIGTERM', function () {
   server.close(function () {
       mongoose.disconnect();
       log.info(`${process.title} finished all requests, exiting gracefully`);
   });
});

log.info(`bikeindustryjobs running on 9004`);