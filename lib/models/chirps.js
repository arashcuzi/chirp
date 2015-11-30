var Mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = Mongoose.Schema;

// example chirp:
// var exampleChirp = {
//     "user": "56514e10950cbe2f18f7ab8e",
//     "chirp": "this is my cool chirp, yo!",
//     "reChirp": "56513652ecc6e35c143b2a1a"
// };

var chirpSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    chirp: { type: String },
    dateSubmitted: { type: String },
    reChirp: { type: Schema.Types.ObjectId, ref: 'chirp' }
});

chirpSchema.index({ chirp: 'text' });

var chirp = Mongoose.model('chirp', chirpSchema);

module.exports = {
    Chirp: chirp
};