var Boom = require('boom');
var User = require('../../models/users').User;

module.exports = function(request, reply){
    var user = new User(request.payload);

    user.password = user.generateHash(user.password);

    user.save(function(err, user){
        if (!err) {
            return reply(user).created('/user/' + user._id);
        } else {
            return reply(Boom.badRequest(err));
        }
    });
};