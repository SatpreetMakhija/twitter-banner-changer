const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    screenName: String,
    twitterId: String,
    profileImageUrl: String,
    accessToken: String,
    tokenSecret: String,
    currentAlbumInRotation: String,
    isAdmin: {type: Boolean, default: false},
    albums: [{
        albumName: String,
        createdOn: Date,
        bannersURLs: [String],
        frequencyOfUpdateInHours : Number,
       
    }]
});

const User = mongoose.model("user", userSchema);

module.exports = User;
