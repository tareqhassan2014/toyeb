const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const { errorResponseObject } = require('../controllers/ResponseObject');

AuthenticatorJWT = (req, res, next) => {
    const tokenWithBearer = req.headers.authorization;
    const token = tokenWithBearer?.split(' ')[1];

    if (!token) {
        res.json(
            errorResponseObject({ data: 'No data' }, 'No token. Access Denied')
        );
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.json(
            errorResponseObject(
                { data: 'No data' },
                'You cannot access this route due to invalid token.'
            )
        );
    }
};

module.exports = { AuthenticatorJWT };
