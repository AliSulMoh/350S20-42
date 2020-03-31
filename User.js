var mongoose = require('mongoose');

//This is gonna be something different depending on where the database is located. 
mongoose.connect('mongodb://localhost:27017/database');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    hospitalOwner: Boolean,
    numberOfStaff: Number,
    //this will be an array of Users of the staff (since usernames are unique)
    staffArray: this,
    medicalAccount: Boolean
});

//export userschema as a class called User
module.exports = mongoose.model('User', userSchema);