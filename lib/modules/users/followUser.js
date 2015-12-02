var Boom = require('boom');
var User = require('../../models/users').User;

module.exports = function(request, reply){
    User.findOne({ _id: request.params.userId }, function(err, user){
        var added;

        if (!err) {
            if (user.follow.indexOf(request.payload.follow) === -1) {
                added = true;
                user.follow.push(request.payload.follow);
            } else {
                added = false;
                user.follow.splice(user.follow.indexOf(request.payload.follow), 1);
            }

            user.save(function(err, user){
                if (!err) {
                    return reply({user: user, added: added});
                } else {
                    return reply(Boom.forbidden(getErrorMessageFrom(err)));
                }
            });
        } else {
            return reply(Boom.badImplementation(err));
        }
    });
};