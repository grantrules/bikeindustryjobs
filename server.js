var config = require('./config');

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('./models/user');


mongoose.connect(config.mongodb);


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());


// CORS stuff, only needed for dev
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// LOCAL LOGIN
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
    

        User.findOne({'email': email}, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            if (!user.validatePassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    
    }
));

// JWT
passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWTsecret
    },
    function(jwt_payload, done) {
        // expires in in jwt_payload.exp stores as unixtime

        done(null, jwt_payload);
    }
));

// All routes
require('./routes/routes')(app);

var server = app.listen(9004);

process.on( 'SIGTERM', function () {
   server.close(function () {
       mongoose.disconnect();
       console.log(`${process.title} finished all requests, exiting gracefully`);
   });
});

console.log(`bikeindustryjobs running on 9004`);