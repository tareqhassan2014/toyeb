const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'tareqhassanjim',
    api_key: '319887965695463',
    api_secret: 'UK7M3EtEgiFSMd6QpMxBeSoQuLY',
});

module.exports = cloudinary;
