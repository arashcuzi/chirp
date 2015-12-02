var Boom = require('boom');
var Chirp = require('../../models/chirps').Chirp;

module.exports = function(request, reply){
    if (request.query.q) {
        var keywords = request.query.q;

        Chirp.find({
            $text: {
                $search: keywords
            }
        }).populate('user')
        .sort({ dateSubmitted: -1})
        .exec(function(err, chirps){
            if (!err) {
                return reply(chirps);
            } else {
                return reply(Boom.notFound(err));
            }
        });
    } else {
        Chirp.find({}).populate('user')
        .sort({ dateSubmitted: -1})
        .exec(function(err, chirps){
            if (!err) {
                return reply(chirps);
            } else {
                return reply(Boom.notFound(err));
            }
        });
    }
};