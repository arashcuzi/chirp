var User = require('../lib/models/users').User;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var Boom = require('boom');
var config = require('../config/config');

// validate function for authorization
function validate(request, username, password, callback) {
    console.log('validate: ' + username + ' ' + password);
    User.findOne({ handle: username }, function(err, user){
        if (!user) {
            return reply(Boom.notFound('Wrong handle and/or password.'));
        }
        bcrypt.compare(password, user.password, function(err, isValid) {
            var token = '';
            if (!err) {
                token = jwt.sign(user, config.auth.key, {
                    expiresIn: 86400
                });
            }
            callback(err, isValid, {
                id: user._id,
                handle: user.handle,
                token: token,
                user: user
            });
        });
    });
}

// validate token function
function validateToken(decoded, request, callback) {
    return callback(null, true);
}

module.exports = {
    validate: validate,
    validateToken: validateToken
};