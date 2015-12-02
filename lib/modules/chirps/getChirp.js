var Boom = require('boom');
var Chirp = require('../../models/chirps').Chirp;

module.exports = function(request, reply){
    Chirp.findOne({ _id: request.params.chirpId }, function(err, chirp){
        if (!err) {
            return reply(chirp);
        } else {
            return reply(Boom.notFound(err));
        }
    });
};