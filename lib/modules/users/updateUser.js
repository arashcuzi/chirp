var Boom = require('boom');
var User = require('../../models/users').User;

module.exports = function(request, reply){
    User.findOne({ _id: request.params.userId }, function(err, user){
        if (!err) {
            var newUser = request.payload;

            Object.keys(newUser).forEach(function(val, i){
                if (val === 'password') { // hash password for new password
                    newUser[val] = user.generateHash(newUser[val]);
                }
                user[val] = newUser[val];
            });

            user.save(function(err, user){
                if (!err) {
                    reply().code(204);
                } else {
                    reply(Boom.forbidden(err));
                }
            });
        } else {
            return reply(Boom.badRequest(err));
        }
    });
};