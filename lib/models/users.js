var Mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = Mongoose.Schema;

// example user:
// var exampleUser = {
//     "firstName": "Jane",
//     "lastName": "Doe",
//     "handle": "JoJo",
//     "email": "yoo@hoo.com",
//     "password": "pass",
//     "scope": "admin"
// };

var userSchema = new Schema({ // all validation done in handler via Joi
    firstName: { type: String },
    lastName: { type: String },
    handle: { type: String },
    email: { type: String },
    password: { type: String },
    scope: { type: String },
    dateRegistered: { type: Date },
    follow: [ { type: Schema.Types.ObjectId, ref: 'user' } ],
    apiKey: { type: String }
});

// methods ============
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

var user = Mongoose.model('user', userSchema);

module.exports = {
    User: user
};