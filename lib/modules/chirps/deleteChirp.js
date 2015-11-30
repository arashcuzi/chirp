var Boom = require('boom');
var Chirp = require('../../models/chirps').Chirp;
var User = require('../../models/users').User;

module.exports = function(request, reply){
    Chirp.findByIdAndRemove(request.payload.chirpid, function(err){
        console.log(request.payload.chirpid);
        if (!err) {
            return reply().code(204);
        } else {
            return reply(Boom.badRequest(err));
        }
    });
};