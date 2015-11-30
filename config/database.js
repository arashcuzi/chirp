var Mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var config = require('./config');

var options = {
    server: {
        socketOptions: {
            keepAlive: 1,
            connectTimeOutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 1,
            connectTimeOutMS: 30000
        }
    }
};

// var mongodburi = 'mongodb://user:password@host:port/db'
var mongodburi = 'mongodb://' +
    config.database.username + ':' +
    config.database.password + '@' +
    config.database.host + ':' +
    config.database.port + '/' +
    config.database.db;

var mongooseUri = uriUtil.formatMongoose(mongodburi);

Mongoose.connect(mongooseUri, options);

var db = Mongoose.connection;

db.on('error', console.error.bind('console', 'connection error'));

db.once('open', function callback(){
    console.log('database connected');
});

exports.Mongoose = Mongoose;

exports.db = db;