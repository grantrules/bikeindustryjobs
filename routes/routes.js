var express = require('express');
var passport = require('passport');
var controller = require('../controllers/controller');
var userController = require('../controllers/users');

var jwtAuth = passport.authenticate('jwt', {session:false});
var localAuth = passport.authenticate('local', {session:false});

module.exports = app => {
    var router = express.Router();

    app.use('/api/', router);

    // JOBS
    router.route('/jobs')
        .get(controller.getJobs);

    router.route('/companies')
        .get(controller.getCompanies);

    // STARS
    router.route('/stars')
        .get(jwtAuth, controller.getStars);
    
    router.route('/star')
        .delete(jwtAuth, controller.deleteStar);

    // USER
    router.route('/users')
        .get(jwtAuth, userController.getUsers)

        .post(userController.postUsers);

    router.route('/client')
        .delete(jwtAuth, userController.deleteClient);


    // LOGIN
    router.route('/login')
        .post(localAuth, userController.postLogin);

    router.route('/refresh_token')
        .post(userController.postRefreshToken)
}