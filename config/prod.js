module.exports = {
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE,
    email: process.env.GMAIL,
    password: process.env.PASSWORD,
    linkedInClientId: process.env.LINKEDIN_CLIENT_ID,
    linkedInClientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    linkedInRedirectUri: process.env.LINKEDIN_REDIRECT_URI,
    crptrSecret: process.env.CRYPT_SECRET,
    cloudinary_cloud_name: process.env.CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_SECRET_KEY,
}