
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var config = require('../config');
var User = require('../models/user');


module.exports = (app) => {

    app.use(passport.initialize());

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
}