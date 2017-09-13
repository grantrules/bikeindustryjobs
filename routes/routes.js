var express = require('express');
var passport = require('passport');
var controller = require('../controllers/controller');
var userController = require('../controllers/users');

module.exports = app => {
    var router = express.Router();

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
        .post(passport.authenticate('local', {session: false}), userController.postLogin);

    router.route('/refresh_token')
        .post(userController.postRefreshToken)
}