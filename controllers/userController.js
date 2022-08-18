const User = require('../Models/userModel');
var bcrypt = require('bcryptjs');
const config = require('../config/keys');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {
    successResponseObject,
    errorResponseObject,
} = require('./ResponseObject');

exports.getUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
        res.json(successResponseObject({ user }, 'Data found'));
    } else {
        res.json(errorResponseObject({ data: 'No data' }, 'No User found'));
    }
};

exports.signUp = async (req, res) => {
    const ifEmailAlreadyPresent = await User.findOne({ email: req.body.email });

    if (ifEmailAlreadyPresent) {
        res.json(
            errorResponseObject(
                { data: 'No data' },
                'Email already exists. Please try another one.'
            )
        );
    } else {
        var salt = bcrypt.genSaltSync(10);

        var hash = bcrypt.hashSync(req.body.password, salt);

        const user = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            username: req.body.username,
            phone: req.body.phone,
            country: req.body.country,
            countryCode: req.body.countryCode,
            location: req.body.location,
            password: hash,
        });

        const saveUser = await user.save();
        if (saveUser) {
            const {
                _id,
                fullName,
                username,
                email,
                phone,
                country,
                countryCode,
                location,
                createdAt,
                updatedAt,
            } = saveUser;
            res.json(
                successResponseObject(
                    {
                        user: {
                            _id,
                            fullName,
                            username,
                            email,
                            phone,
                            country,
                            countryCode,
                            location,
                            createdAt,
                            updatedAt,
                        },
                    },
                    'Account created successfully!'
                )
            );
        } else {
            res.json(
                errorResponseObject(
                    { data: 'No data' },
                    'Account could not be created.'
                )
            );
        }
    }
};

exports.login = async (req, res) => {
    const findUser = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.email }],
    });
    if (findUser) {
        const checkPassword = bcrypt.compareSync(
            req.body.password,
            findUser.password
        );
        if (checkPassword) {
            const payload = {
                user: {
                    _id: findUser._id,
                },
            };
            jwt.sign(payload, config.jwtSecret, (err, token) => {
                if (err) {
                    res.json(
                        errorResponseObject({ data: 'No data' }, 'Jwt Error')
                    );
                } else {
                    const {
                        _id,
                        fullName,
                        username,
                        email,
                        phone,
                        country,
                        countryCode,
                        location,
                        createdAt,
                        updatedAt,
                    } = findUser;
                    res.json(
                        successResponseObject(
                            {
                                user: {
                                    _id,
                                    fullName,
                                    username,
                                    email,
                                    phone,
                                    country,
                                    countryCode,
                                    location,
                                    createdAt,
                                    updatedAt,
                                    token,
                                },
                            },
                            'Logged In Successfully!'
                        )
                    );
                }
            });
        } else {
            res.json(
                errorResponseObject(
                    { data: 'No data' },
                    'Incorrect username or password'
                )
            );
        }
    } else {
        res.json(
            errorResponseObject(
                { data: 'No data' },
                'Incorrect username or password'
            )
        );
    }
};

exports.changeUserPassword = async (req, res) => {
    if (req.body.newPassword !== req.body.confirmNewPassword) {
        res.json(
            errorResponseObject({ data: 'No data' }, 'Passwords do not match.')
        );
    } else {
        const findUser = await User.findById({ _id: req.user._id });
        if (findUser) {
            const checkPassword = bcrypt.compareSync(
                req.body.oldPassword,
                findUser.password
            );
            if (checkPassword) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.newPassword, salt);
                findUser.password = hash;
                findUser.save((error, result) => {
                    if (error) {
                        res.json(
                            errorResponseObject(
                                { data: 'No data' },
                                'Failed to change password'
                            )
                        );
                    } else {
                        res.json(
                            successResponseObject(
                                { data: 'No data' },
                                'Password changed Successfully.'
                            )
                        );
                    }
                });
            } else {
                res.json(
                    errorResponseObject(
                        { data: 'No data' },
                        'Please enter correct old password.'
                    )
                );
            }
        }
    }
};
1;
/****************************************************** Forgot Password ***********************************************/
exports.sendResetPasswordLink = async (req, res) => {
    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
            console.log(error);
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email }).then((user) => {
            if (!user) {
                res.json(
                    errorResponseObject(
                        { data: 'No data' },
                        'Email does not exist'
                    )
                );
            }
            if (user) {
                // console.log(user);
                user.resetToken = token;
                user.expireToken = Date.now() + 600000;
                user.save((err, result) => {
                    console.log(err, result);
                    if (err) {
                        res.json(
                            errorResponseObject(
                                { data: 'No data' },
                                'Token saving failed'
                            )
                        );
                    }
                    if (result) {
                        let url = '';
                        if (process.env.NODE_ENV === 'production') {
                            url = `https://alterwis.com/update/${token}`; // The url of the domain on which you are hosting your frontend in production mode to serve the reset-password link page by sending this link to the email
                        } else {
                            url = `http://localhost:3000/update/${token}`; // The url of the frontend in developement mode to serve the reset-password link page on the frontend by sending this link to the email
                        }
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: config.email, //put your gmail account here!!!
                                pass: config.password, //put your account password here!!!
                            },
                            tls: {
                                rejectUnauthorized: false,
                            },
                        });
                        transporter
                            .sendMail({
                                from: config.email, //put your gmail account here!!!
                                to: req.body.email,
                                subject: 'Reset Password Link',
                                html: `<p>Click this <a href = ${url}>${url}</a> to reset your password.</p>`,
                            })
                            .then((data) => {
                                res.json(
                                    successResponseObject(
                                        { data },
                                        'Check your Inbox!'
                                    )
                                );
                            });
                    }
                });
            }
        });
    });
};

exports.verfiyToken = async (req, res) => {
    await User.findOne({
        resetToken: req.body.token,
        expireToken: { $gt: Date.now() },
    }).then((user) => {
        if (user) {
            res.json(
                successResponseObject(
                    { user: { token: req.body.token, email: user.email } },
                    'Got Token and Email'
                )
            );
        }
        if (!user) {
            res.json(
                errorResponseObject(
                    { data: 'No data' },
                    'Try again. Session expired!'
                )
            );
        }
    });
};

exports.updatePassword = async (req, res) => {
    if (req.body.newPassword !== req.body.confirmNewPassword) {
        res.json(
            errorResponseObject({ data: 'No data' }, 'Passwords do not match.')
        );
    } else {
        await User.findOne({
            resetToken: req.body.token,
            expireToken: { $gt: Date.now() },
        }).then((user) => {
            if (!user) {
                res.json(
                    errorResponseObject(
                        { data: 'No data' },
                        'Try again. Session expired!'
                    )
                );
            }
            if (user) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.newPassword, salt);
                user.password = hash;
                (user.resetToken = ''),
                    (user.expireToken = ''),
                    user.save((error, result) => {
                        if (error) {
                            res.json(
                                errorResponseObject(
                                    { data: 'No data' },
                                    'Failed to update password'
                                )
                            );
                        } else {
                            res.json(
                                successResponseObject(
                                    { data: 'No data' },
                                    'Password updated Successfully.'
                                )
                            );
                        }
                    });
            }
        });
    }
};

//Linkedin Login
exports.linkedinLogin = async (req, res) => {
    const url = `http://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${req.body.code}&redirect_uri=${config.linkedInRedirectUri}&client_id=${config.linkedInClientId}&client_secret=${config.linkedInClientSecret}`;
    return fetch(url, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((gettingToken) => {
            fetch(
                `https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(handle~))`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ` + gettingToken.access_token,
                    },
                }
            )
                .then((data) => data.json())
                .then((got) => {
                    const email = got.elements[0]['handle~'].emaillocation;
                    User.findOne({ email }).exec((err, user) => {
                        if (user) {
                            const token = jwt.sign(
                                { _id: user._id, role: user.role },
                                config.jwtSecret,
                                {
                                    expiresIn: '7d',
                                }
                            );
                            const {
                                _id,
                                fullName,
                                username,
                                email,
                                phone,
                                country,
                                countryCode,
                                location,
                                createdAt,
                                updatedAt,
                            } = user;
                            res.json(
                                successResponseObject(
                                    {
                                        user: {
                                            _id,
                                            fullName,
                                            username,
                                            email,
                                            phone,
                                            country,
                                            countryCode,
                                            location,
                                            createdAt,
                                            updatedAt,
                                            token,
                                        },
                                    },
                                    'Logged In Successfully!'
                                )
                            );
                        } else {
                            let password = email + config.jwtSecret;
                            user = new User({
                                email,
                                password,
                                username: email,
                            });
                            user.save((err, data) => {
                                if (err) {
                                    console.log(
                                        'ERROR LINKEDIN LOGIN ON USER SAVE',
                                        err
                                    );
                                    res.json(
                                        errorResponseObject(
                                            { data: 'No data' },
                                            'ERROR LINKEDIN LOGIN ON USER SAVE'
                                        )
                                    );
                                } else {
                                    const token = jwt.sign(
                                        { _id: data._id, role: data.role },
                                        config.jwtSecret,
                                        { expiresIn: '7d' }
                                    );
                                    const {
                                        _id,
                                        email,
                                        role,
                                        username,
                                        createdAt,
                                        updatedAt,
                                    } = data;
                                    res.json(
                                        successResponseObject(
                                            {
                                                user: {
                                                    _id,
                                                    email,
                                                    role,
                                                    username,
                                                    createdAt,
                                                    updatedAt,
                                                    token,
                                                },
                                            },
                                            'Logged In Successfully!'
                                        )
                                    );
                                }
                            });
                        }
                    });
                });
        });
};

/******************************************** Update Profile ***************************************/
exports.updateUser = async (req, res) => {
    const findUser = await User.findOne({ _id: req.user._id });
    if (findUser) {
        findUser.fullName = req.body.fullName;
        findUser.email = req.body.email;
        findUser.phone = req.body.phone;
        findUser.country = req.body.country;
        const saveUser = await findUser.save();
        const {
            _id,
            fullName,
            username,
            email,
            phone,
            country,
            countryCode,
            createdAt,
            updatedAt,
        } = saveUser;
        if (saveUser) {
            res.json(
                successResponseObject(
                    {
                        user: {
                            _id,
                            fullName,
                            username,
                            email,
                            phone,
                            country,
                            countryCode,
                            createdAt,
                            updatedAt,
                        },
                    },
                    'User updated successfully!'
                )
            );
        } else {
            res.json(
                errorResponseObject(
                    { data: 'No data' },
                    'Failed to update user'
                )
            );
        }
    } else {
        res.status(404).json({ errorMessage: 'User not found.' });
    }
};
