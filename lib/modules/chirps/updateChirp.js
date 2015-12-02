var Boom = require('boom');
var Chirp = require('../../models/chirps').Chirp;

module.exports = function(request, reply){
    Chirp.findOne({ _id: request.params.chirpId }, function(err, chirp){
        if (!err) {
            console.log(request.payload.chirp);
            console.log(chirp.chirp);
            if (request.payload.chirp) {
                chirp.chirp = request.payload.chirp;
            }
            console.log(chirp.chirp);

            chirp.save(function(err, chirp){
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