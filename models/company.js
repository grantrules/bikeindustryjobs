var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
	company: String,
    title: String,
	location: String,
	website: String,
    about: String,
	jobs_url: String,
    logo: String,
	hasScraper: Boolean,
});

module.exports = mongoose.model('Company', companySchema);
