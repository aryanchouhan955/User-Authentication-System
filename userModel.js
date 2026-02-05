const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/user-login-system');

const userData = mongoose.Schema({
    userid: String,
    name: String,
    password: String,
    email: String
})

module.exports = mongoose.model('user', userData)

