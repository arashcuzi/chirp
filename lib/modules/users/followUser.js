var Boom = require('boom');
var User = require('../../models/users').User;

module.exports = function(request, reply){
    User.findOne({ _id: request.params.userId }, function(err, user){

        if (!err) {
            if (user.follow.indexOf(request.payload.follow) === -1) {
                user.follow.push(request.payload.follow);
            } else {
                user.follow.splice(user.follow.indexOf(request.payload.follow), 1);
            }
            user.save(function(err, user){
                if (!err) {
                    return reply(user);
                } else {
                    return reply(Boom.forbidden(getErrorMessageFrom(err)));
                }
            });
        } else {
            return reply(Boom.badImplementation(err));
        }
    });
};