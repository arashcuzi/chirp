var Boom = require('boom');
var User = require('../../models/users').User;

module.exports = function(request, reply){
    User.find({}, function(err, users){
        if (!err) {
            return reply(users);
        } else {
            return reply(Boom.badRequest(err));
        }
    });
};