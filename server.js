var config = require('./config');

var express = require('express');
var controller = require('./controllers/controller');
var userController = require('./controllers/users');

var bodyParser = require('body-parser');

var passport = require('passport');
var jwt = require('jsonwebtoken');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');


var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



var mongoose = require('mongoose');
mongoose.connect(config.mongodb);




// LOCAL LOGIN

app.use(passport.initialize());
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

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWTsecret
    },
    function(jwt_payload, done) {
        done(null, jwt_payload);
    }
));




var router = express.Router();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api/', router);

// for auth: passport.authenticate('jwt', {session:false})

// JOBS
router.route('/jobs')
    .get(controller.getJobs);

router.route('/companies')
    .get(controller.getCompanies);


// USER
router.route('/users')
    .get(passport.authenticate('jwt', {session:false}), userController.getUsers)

    .post(userController.postUsers);


// LOGIN
router.route('/login')
    .post(passport.authenticate('local', {session: false}), function(req, res) {
        res.json({'user': req.user, 'token': jwt.sign(req.user,config.JWTsecret)});
    }
);





var server = app.listen(9004);

process.on( 'SIGTERM', function () {
   server.close(function () {
       mongoose.disconnect();
       console.log(`${process.title} finished all requests, exiting gracefully`);
   });
});

console.log(`bikeindustryjobs running on 9004`);