var Hapi = require('hapi');
var Good = require('good');
var Inert = require('inert');
var config = require('./config/config');
var db = require('./config/database');
var Auth = require('hapi-auth-basic');
var hapiAuthJwt = require('hapi-auth-jwt2');
var validate = require('./utils/utils').validate;
var validateToken = require('./utils/utils').validateToken;

// Create a server with host and port
var server = new Hapi.Server();

server.connection({
    host: config.server.host,
    port: config.server.port
});

// register auth on server
server.register(Auth, function(err) {
    if (err) {
        console.log(err);
    }

    server.auth.strategy('simple', 'basic', { validateFunc: validate });
});

// register jwt token plugin
server.register(hapiAuthJwt, function(err) {
    if (err) {
        console.log(err);
    }

    server.auth.strategy('jwt', 'jwt', {
        key: config.auth.key,
        validateFunc: validateToken
    });
});

// register vision and handlebars per HAPI api documentation
server.register(require('vision'), function(err){
    if (!err) {
        server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: './templates',
            layoutPath: './templates/layouts',
            layout: true
        });
    }
});

// register default auth method
// server.auth.default('jwt');

// hello world route
server.route({
    method: 'GET',
    path: '/',
    handler: {
        view: 'index'
    }
});

server.route({
    method: 'GET',
    path: '/wall',
    handler: {
        view: 'wall'
    }
});

server.route({
    method: 'GET',
    path: '/register',
    handler: {
        view: 'register'
    }
});

// Login route/handler
server.route({
    method: 'GET',
    path: '/login',
    config: {
        auth: 'simple',
        handler: function(request, reply) {
            reply(request.auth.credentials);
        }
    }
});

// Start the server
server.register([{
    register: require('./lib/modules/users')
},{
    register: require('./lib/modules/chirps')
},{
    register: Inert
},{
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                request: '*',
                log: '*',
                error: '*'
            }
        }]
    }
}], function(err){
    if (err) {
        throw err;
    } else {
        // static route
        server.route({
            method: 'GET',
            path: '/{param*}',
            config: {
                handler: {
                    directory: { path: __dirname + '/public' }
                }
            }
        });

        server.start(function(err) {
            console.log('Server running at:', server.info.uri);
        });
    }
});