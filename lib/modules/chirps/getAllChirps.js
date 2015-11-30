var Boom = require('boom');
var Chirp = require('../../models/chirps').Chirp;
var User = require('../../models/users').User;

module.exports = function(request, reply){
    User.findOne({ _id: request.params.userId }, function(err, user){
        if (!err) {
            Chirp.find({
                $or: [
                    { user: user._id },
                    { user: { $in: user.follow } }
                ]
            }).populate('user')
            .sort({ dateSubmitted: -1 })
            .exec(function(err, chirps){
                if (!err) {
                    return reply(chirps);
                } else {
                    return reply(Boom.forbidden(err));
                }
            });
        } else {
            return reply(Boom.notFound(err));
        }
    });
};