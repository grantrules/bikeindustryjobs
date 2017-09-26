var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var config = require('../config');
var User = require('../models/user');
var Client = require('../models/auth/client');

// POST /api/users
// register
exports.postUsers = function(req,res) {
    var user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        hashed_password: User.hashPassword(req.body.password)
    }
    
    console.log(`registering user ${user.email}`);

    User.create(user, function(err, user) {
        if (err) {
            if (err.errmsg.match(/dup key/)) {
                res.status(400);
                res.json({err: "account exists"});
            } else {
                res.send(err);
                console.log(err);
                console.log(user);
            }
        }
        else {
            user.hashed_password = null;

            var refresh_token = jwt.sign({refresh_token: true, user: user, date: new Date()}, config.JWTsecret);
            var client = new Client({
                user_id: user._id,
                refresh_token,
                login_date: new Date(),                
                user_agent: req.headers['user-agent'] ? req.headers['user-agent'] : null,
            });
    
            client.save((err, client) => {
                res.json({
                    user: user,
                    token: jwt.sign({user: user, created: new Date()},config.JWTsecret,{expiresIn: "2h"}),
                    refresh_token: refresh_token
                });
            });
        }
    });
        
};

exports.postRefreshToken = (req,res) => {
    var refresh_token = req.body.refresh_token;
    Client.findOne({refresh_token}, (err, client) => {
        if (client) {
            User.findOne({_id:client.user_id}, (err, user) => {
                if (user) {
                    res.json({
                        user: user,
                        token: jwt.sign({user: user, created: new Date()},config.JWTsecret,{expiresIn: "2h"})
                    });
                }
            })
        } else {
            res.json({error: "Could not find refresh token"});
        }
    })
}

exports.postLogin = (req, res) => {
    var refresh_token = jwt.sign({refresh_token: true, user: req.user, date: new Date()}, config.JWTsecret);

    var client = new Client({
        user_id: req.user._id,
        refresh_token,
        login_date: new Date(),
        user_agent: req.headers['user-agent'] ? req.headers['user-agent'] : null,
     });

    client.save((err, client) => {
        if (client) {
            res.json({
                user: req.user,
                token: jwt.sign({user:req.user},config.JWTsecret, {expiresIn: "2h"}),
                refresh_token: refresh_token
            });
        } else {
            console.log(`error creating client on login: ${err}`);
            res.json({err: "Cannot create client"});
        }
    });
}

exports.getUsers = function(req,res) {
    res.json({});
}

exports.deleteClient = (req, res) => {
    var id = req.user._id;
    Client.findOneAndRemove({_id: req.body.client_id, user_id: id}, err => {
        if (err) {
            console.log("error deleting client");
            res.json({'error': "Error logging out"});
        } else {
            res.json({'success': "Logged out"});
        }
    });
}