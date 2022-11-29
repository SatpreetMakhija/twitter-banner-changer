const { default: mongoose } = require("mongoose");
const fs = require('fs');
const MongoStore = require("connect-mongo");
const User = require("./user-model");
const TwitterClient = require('twitter-api-client').TwitterClient;
mongoose.connect("mongodb://localhost:27017/twitterbanner");

module.exports = function (job, done) {
    /**
  * parameters passed are user's id and bannersURLCounter
  * Using user's id, find the album urls, accessToken, tokenSecret, 
  * Then call the Twitter API
  */
  console.log("Inside processing function...")
  const user = User.findById(job.data.userId).exec();
  user.then(async (user) => {
      /**
       * Here we have the user details now. 
       * We can call the api here. We have all the data available. 
       * 
       */
       const twitterClient = new TwitterClient({
        apiKey: process.env.TWITTER_CONSUMER_KEY,
        apiSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessToken: user.accessToken,
        accessTokenSecret: user.tokenSecret
      });
     

      const bannerURL = "http://" + user.albums[0].bannersURLs[job.data.bannersURLsCounter].slice(8);
      console.log("The current bannerURL is", bannerURL);
      if (job.data.bannersURLsCounter <= user.albums.length) {
            console.log("inside call api loop");
            
           const image = fs.readFileSync('./uploads/2022-11-27T13:02:06.061ZfindYourStyle.png')
           try {
            const response = await twitterClient.accountsAndUsers.accountUpdateProfileBanner({banner: image});
           } catch (err) {
                console.log(err);
           }
           console.log(response);
          const result = {bannersURLsCounter: job.data.bannersURLsCounter + 1, frequency: user.albums[0].frequencyOfUpdateInHours}
          console.log("hello")
          done(null, result);
      } else {
          const result = {bannersURLsCounter: 0, frequency: user.albums[0].frequencyOfUpdateInHours};
          done(null, result);
      }

  });
}