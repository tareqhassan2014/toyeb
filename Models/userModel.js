const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        default: ""
    },
    phone: {
        type: Number,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    countryCode: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    resetToken: {
        type: String
    },
    expireToken: {
        type: String
    },
    defaultPosts: {
        type: Array,
        default: []
    },
}, { timestamps: true }
);

const userModel = new mongoose.model('User', userSchema);
module.exports = userModel;
