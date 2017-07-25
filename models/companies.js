var mongoose = require('mongoose');
var slug = require('slug')


var companySchema = new mongoose.Schema({
    title: String,
	location: String,
	website: String,
    about: String,
    thumbnail: String,
});

