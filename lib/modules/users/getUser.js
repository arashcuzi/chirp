var Boom = require('boom');
var User = require('../../models/users').User;

module.exports = function(request, reply){
    User.findOne({ _id: request.params.userId }, function(err, user){
        if (!err) {
            return reply(user);
        } else {
            return reply(Boom.notFound(err));
        }
    });
};