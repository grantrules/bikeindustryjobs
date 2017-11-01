var express = require('express');
var passport = require('passport');
var jobController = require('../controllers/jobs');
var companyController = require('../controllers/companies');
var userController = require('../controllers/users');

var jwtAuth = passport.authenticate('jwt', {session:false});
var localAuth = passport.authenticate('local', {session:false});

module.exports = app => {
    var router = express.Router();

    app.use('/api/', router);

    // JOBS
    router.route('/jobs')
        .get(jobController.getJobs)
        .post(jwtAuth, jobController.postJobs)
        .delete(jwtAuth, jobController.deleteJob);

    router.route('/companies')
        .get(companyController.getCompanies)
        .post(jwtAuth, companyController.postCompanies);

    router.route('/companies/my')
        .get(jwtAuth, companyController.getMyCompanies)
        
    // STARS
    router.route('/stars')
        .get(jwtAuth, jobController.getStars)
        .post(jwtAuth, jobController.postStars)
    
    router.route('/star')
        .delete(jwtAuth, jobController.deleteStar);

    

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

    router.route('/oauth2/strava')
        .get(passport.authenticate('strava', { failureRedirect: '/login' }),userController.postLogin)
}