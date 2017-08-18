var mongoose = require('mongoose');
var crypto = require('crypto');
var config = require('../config');

    var userSchema = new mongoose.Schema({
        first_name: String,
        last_name: String,
        email: {
            type: String,
            required: true,
            index: {
              unique: true,
              sparse: true
            }
        },
        hashed_password: String,
        role: String,
        date_added: Date,
    });

    userSchema.static.hashPassword = function(password,callback) {
        hash = crypto.createHash('sha256').update(password + config.secret)
            .digest('base64').toString();
        //if callback
        //    callback(hash);
        return hash;

    }
    
    userSchema.methods.validatePassword = function(password) {
        return this.hashed_password == userSchema.static.hashPassword(password);
    }
    
    userSchema.statics.ROLES = {
        user: "user",
        admin: "admin",
        superuser: "superuser",
        deactivated: "deactivated",
    };

    mongoose.model('User', userSchema);
    module.exports = mongoose.model('User');