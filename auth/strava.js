var passport = require('passport');
var StravaStrategy = require('passport-strava-oauth2').Strategy;

var mongoose = require('mongoose');

var User = mongoose.model('User');

module.exports = {


    
    init: (app) => {

        // http://strava.github.io/api/v3/oauth/

        var STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
        var STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

        STRAVA_CLIENT_ID = 20313;
        STRAVA_CLIENT_SECRET = "b8046aee95520c8d559904d7ee00ded65aba8665";

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

                        // not sure how to check if it doesn't exist
                        if (false) {
                            user = new User({email, first_name, last_name, apilogin});
                            User.create(user, (err,user)=>{
                                return done(null, user);
                            })
                        }
                    } else {

                        // if user has never signed on with strava before
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
                })
            //});
        }
        ));

    }
}