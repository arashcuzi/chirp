var Joi = require('joi');

exports.register = function(server, options, next) {
    server.route({
        path: '/chirps',
        method: 'GET',
        config: {
            auth: {
                strategy: 'jwt'
            },
            validate: {
                query: {
                    q: Joi.string()
                }
            },
            description: 'gets all chirps, unless query param',
            handler: require('./getChirps')
        }
    });

    // server.route({
    //     path: '/chirps/author/{userId}',
    //     method: 'GET',
    //     config: {
    //         description: 'gets all chirps for author',
    //         handler: require('./getUserChirps')
    //     }
    // });

    server.route({
        path: '/chirps/{chirpId}',
        method: 'GET',
        config: {
            description: 'gets specific chirp',
            handler: require('./getChirp')
        }
    });

    server.route({
        path: '/chirps',
        method: 'POST',
        config: {
            auth: {
                strategy: 'jwt'
            },
            validate: {
                payload: {
                    user: Joi.string().required(),
                    chirp: Joi.string().required().max(144),
                    dateSubmitted: Joi.date().default(Date.now, 'date submitted')
                }
            },
            description: 'creates a chirp',
            handler: require('./createChirp')
        }
    });

    server.route({
        path: '/chirps/{chirpId}',
        method: 'PUT',
        config: {
            auth: {
                strategy: 'jwt'
            },
            validate: {
                params: {
                    chirpId: Joi.string().required()
                }
            },
            description: 'updates a chirp',
            handler: require('./updateChirp')
        }
    });

    server.route({
        path: '/chirps/follow/{userId}',
        method: 'GET',
        config: {
            auth: {
                strategy: 'jwt'
            },
            validate: {
                params: {
                    userId: Joi.string().required()
                }
            },
            description: 'gets all user\'s chirps and those of followed',
            handler: require('./getAllChirps')
        }
    });

    server.route({
        path: '/chirps',
        method: 'DELETE',
        config: {
            validate: {
                payload: {
                    chirpid: Joi.string().required()
                }
            },
            description: 'deletes a chirp',
            handler: require('./deleteChirp')
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};