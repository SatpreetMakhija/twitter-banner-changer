const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    screenName: String,
    twitterId: String,
    profileImageUrl: String,
    accessToken: String,
    tokenSecret: String,
    albums: [{
        albumName: String,
        createdOn: Date,
        bannersURLs: [String],
        frequencyOfUpdateInDays : Number,
       
    }]
});

const User = mongoose.model("user", userSchema);

module.exports = User;
