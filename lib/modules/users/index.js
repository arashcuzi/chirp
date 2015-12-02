var Joi = require('joi');

exports.register = function(server, options, next) {
    server.route({
        path: '/users',
        method: 'GET',
        config: {
            auth: {
                scope: ['user', 'admin'],
                strategy: 'jwt'
            },
            description: 'gets all users',
            handler: require('./getUsers')
        }
    });

    server.route({
        path: '/users/{userId}',
        method: 'GET',
        config: {
            auth: {
                scope: 'admin',
                strategy: 'jwt'
            },
            description: 'get user',
            handler: require('./getUser')
        }
    });

    server.route({
        path: '/users',
        method: 'POST',
        config: {
            auth: {
                scope: 'admin',
                strategy: 'jwt'
            },
            validate: {
                payload: {
                    firstName: Joi.string().max(20).required(),
                    lastName: Joi.string().max(30).required(),
                    handle: Joi.string().max(20).required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().min(4).max(20).required(),
                    scope: Joi.array().default('user').items(Joi.string().valid('user', 'admin')).single(),
                    dateRegistered: Joi.date().default(Date.now, 'date registered')
                }
            },
            description: 'create user',
            handler: require('./createUser')
        }
    });

    server.route({
        path: '/users/{userId}',
        method: 'PUT',
        config: {
            auth: {
                scope: 'admin',
                strategy: 'jwt'
            },
            validate: {
                payload: {
                    firstName: Joi.string().max(20),
                    lastName: Joi.string().max(30),
                    handle: Joi.string().max(20),
                    email: Joi.string().email(),
                    password: Joi.string().min(4).max(20)
                }
            },
            description: 'update user',
            handler: require('./updateUser')
        }
    });

    server.route({
        path: '/users/{userId}',
        method: 'DELETE',
        config: {
            auth: {
                scope: 'admin',
                strategy: 'jwt'
            },
            description: 'delete user',
            handler: require('./deleteUser')
        }
    });

    server.route({
        path: '/users/register',
        method: 'POST',
        config: {
            validate: {
                payload: {
                    firstName: Joi.string().max(20).required(),
                    lastName: Joi.string().max(30).required(),
                    handle: Joi.string().max(20).required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().min(4).max(20).required(),
                    scope: Joi.array().default('user').items(Joi.string().valid('user', 'admin')).single(),
                    dateRegistered: Joi.date().default(Date.now, 'date registered')
                }
            },
            description: 'register and create user',
            handler: require('./createUser')
        }
    });

    server.route({
        path: '/users/chirps/{userId}',
        method: 'GET',
        config: {
            description: 'get num of chirps for user',
            handler: require('./getChirps')
        }
    });

    server.route({
        path: '/users/follow/{userId}',
        method: 'PUT',
        config: {
            description: 'add follows',
            handler: require('./followUser')
        }
    });

    server.route({
        path: '/users/apikey',
        method: 'PUT',
        config: {
            validate: {
                payload: {
                    apiKey: Joi.string().required()
                }
            },
            description: 'update api key',
            handler: require('./userApi')
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};