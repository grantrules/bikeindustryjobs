var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
    title: String,
	url: String,
    description: String,
    first_seen: { type: Date, default: Date.now },
	last_seen: { type: Date, default: Date.now },
    company: String,
	location: String,
});

module.exports = mongoose.model('Job', jobSchema);
