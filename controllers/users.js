mongoose = require('mongoose');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');

// POST /api/users
exports.postUsers = function(req,res) {
    var user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        hashed_password: User.hashPassword(req.body.password)
    }
    
    console.log(`registering user ${user.email}`);

    User.create(user, function(user, err) {
        if (err)
            res.send(err);
        else
            res.json({'user': user, 'token':    jwt.sign(user,config.JWTsecret)}); 
    });
        
};

exports.getUsers = function(req,res) {
    res.json({});
}