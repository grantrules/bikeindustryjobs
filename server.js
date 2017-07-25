var express = require('express');
var controller = require('./controller');
//var bodyParser = require('body-parser');



var app = express();


var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/bikeindustryjobs');

var router = express.Router();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api/', router);

// RESTAURANTS
router.route('/jobs')
    .get(controller.getJobs);

router.route('/companies')
    .get(controller.getCompanies);


var server = app.listen(9004);

process.on( 'SIGTERM', function () {
   server.close(function () {
       mongoose.disconnect();
       console.log(`${process.title} finished all requests, exiting gracefully`);
   });
});

console.log(`bikeindustryjobs running on 9004`);