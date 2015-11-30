var Boom = require('boom');
var User = require('../../models/users').User;

module.exports = function(request, reply){
    User.findByIdAndRemove(request.params.userId, function (err, user) {
        if (!err) {
            return reply('user ' +
                user._id + ' named ' +
                user.firstName + ' ' +
                user.lastName + ' deleted').code(200);
        } else {
            return reply(Boom.notFound(err));
        }
    });
};