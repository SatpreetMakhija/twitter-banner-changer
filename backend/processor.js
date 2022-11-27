/**
 * 
 * To import
 * User module
 * 
 */
 const { default: mongoose } = require("mongoose");
const MongoStore = require("connect-mongo");
const User = require("./user-model");
mongoose.connect("mongodb://localhost:27017/twitterbanner");

module.exports = function (job, done) {
    /**
  * parameters passed are user's id and bannersURLCounter
  * Using user's id, find the album urls, accessToken, tokenSecret, 
  * Then call the Twitter API
  */
  console.log("Inside processing function...")
  const user = User.findById(job.data.userId).exec();
  user.then((user) => {
      /**
       * Here we have the user details now. 
       * We can call the api here. We have all the data available. 
       * 
       */
      console.log("The user's details are");
      console.log(user.albums[0].bannersURLs[job.data.bannersURLsCounter]);
      if (job.data.bannersURLsCounter <= user.albums.length) {
          const result = {bannersURLsCounter: job.data.bannersURLsCounter + 1, frequency: user.albums[0].frequencyOfUpdateInHours}
          done(null, result);
      } else {
          const result = {bannersURLsCounter: 0, frequency: user.albums[0].frequencyOfUpdateInHours};
          done(null, result);
      }

  });
}