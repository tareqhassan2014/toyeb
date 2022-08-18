const express = require('express');
const { signUp, login, getUserById, changeUserPassword, sendResetPasswordLink, updatePassword, linkedinLogin, verfiyToken } = require('../controllers/userController');
const { AuthenticatorJWT } = require('../middlewares/authenticator');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/linkedin/login', linkedinLogin);
router.get('/get/:id', getUserById);
router.post('/reset-password/:id', AuthenticatorJWT, changeUserPassword);
router.post('/verify-token', verfiyToken);
router.post('/forgot-password', sendResetPasswordLink);
router.post('/update-password', updatePassword);

module.exports = router;