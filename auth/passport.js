var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var config = require('../config');
var User = require('../models/user');

var Strava = require('./strava');


module.exports = (app) => {

    app.use(passport.initialize());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // LOCAL LOGIN
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
        

            User.findOne({'email': email}, function(err, user) {
                if (err) { return done(err); }
                if (!user || !user.validatePassword(password)) {
                    return done(null, false, { message: 'Incorrect email/password.' });
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
            // TODO, token expiration
            // expires in in jwt_payload.exp stores as unixtime

            done(null, jwt_payload.user);
        }
    ));

    // STRAVA
    Strava.init(app);


}