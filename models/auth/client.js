var mongoose = require('mongoose');

var clientSchema = new mongoose.Schema({
    user_agent : { type: String, unique: true, required: true },
    refresh_token: { type: String, required: true },
    user_id: { type: String, required: true }
});

module.exports = mongoose.model('Client', clientSchema);