const mongoose = require('mongoose');
const GUID = require('mongoose-guid')(mongoose);
const userSchema = new mongoose.Schema({
    _id: {type: GUID.type, default: GUID.value},
    userName: {type: String, required: true},
    nickName: {type: String, required: true},
    email: {type: String, required: true},
    hash: {type: String, required: true},
    salt: {type: String, required: true},
    role: {type: String, required: true},
    confirmed: {type: Boolean, required: true},
    dateRegistration: {type: String, required: true},
    avatar: {type: String, required: true},
    token: {type: String, required: true},
},
    {collection:'users',
    versionKey: false}, // disable field __v
);
module.exports = mongoose.model('User', userSchema);;