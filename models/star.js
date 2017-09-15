var mongoose = require('mongoose');

var starSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    job_id: { type: String, required: true }
});

starSchema.index({user_id: 1, job_id: 1}, {unique: true});

module.exports = mongoose.model('Star', starSchema);
