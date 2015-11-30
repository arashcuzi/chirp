var Boom = require('boom');
var Chirp = require('../../models/chirps').Chirp;
var User = require('../../models/users').User;

module.exports = function(request, reply){
    var chirp = new Chirp(request.payload);

    chirp.save(function(err, user){
        if (!err) {
            return reply(chirp).created('/chirp/' + chirp._id);
        } else {
            return reply(Boom.badRequest(err));
        }
    });
};