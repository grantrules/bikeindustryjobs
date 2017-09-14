var mongoose = require('mongoose');

var clientSchema = new mongoose.Schema({
    user_agent : { type: String, required: true },
    refresh_token: { type: String, required: true },
    login_date: { type: Date, required: true },
    user_id: { type: String, required: true }
});

module.exports = mongoose.model('Client', clientSchema);