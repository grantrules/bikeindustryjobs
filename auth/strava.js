var passport = require('passport');
var StravaStrategy = require('passport-strava-oauth2').Strategy;

var mongoose = require('mongoose');

var User = mongoose.model('User');

var config = require('../config');
var email = require('../utils/email');

module.exports = {


    
    init: (app) => {

        // http://strava.github.io/api/v3/oauth/

        var STRAVA_CLIENT_ID = config.STRAVA_CLIENT_ID;
        var STRAVA_CLIENT_SECRET = config.STRAVA_CLIENT_SECRET;

        // Use the StravaStrategy within Passport.
        //   Strategies in Passport require a `verify` function, which accept
        //   credentials (in this case, an accessToken, refreshToken, and Strava
        //   profile), and invoke a callback with a user object.
        passport.use(new StravaStrategy({
            clientID: STRAVA_CLIENT_ID,
            clientSecret: STRAVA_CLIENT_SECRET,
            callbackURL: "http://127.0.0.1:9000/auth/strava/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            // asynchronous verification, for effect...
            //process.nextTick(() => {

                // create user if email doesn't exist in database
                console.log(profile);

                var email = profile._json.email;
                var first_name = profile._json.firstname;
                var last_name = profile._json.lastname;
                var apilogin = {strava: profile._json}

                console.log(`found strava user ${email}`)
                User.findOne({email}, (err, user) => {
                    if (err) {
                        console.log(err);
                    } else {

                        if (!user) {
                            // create user if it doesn't exist
                            user = new User({email, first_name, last_name, apilogin});
                            User.create(user, (err,user)=>{
                                email(`"${first_name} ${last_name}" <${email}>`, "Welcome to careers.bike!", "Thanks for registering!\n\nYou can now save jobs or post jobs for free!\n\nhttp://careers.bike/profile/","",(err,info) => { console.log(err||info) })
                                return done(null, user);
                            })
                        } else {
                            // if user exists & has never signed on with strava before
                            // add strava profile to apilogin and update user

                            apilogin = user.apilogin || {};

                            if (!apilogin.strava) {
                                apilogin.strava = profile._json;
                                User.update(user, {apilogin}, (err,user) => {
                                    return done(err,user)
                                })
                            } else {                            
                                
                                return done(null, user);
                            }
                        }
                    }
                })
            //});
        }
        ));

    }
}