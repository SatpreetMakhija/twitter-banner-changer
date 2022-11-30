const { default: mongoose } = require("mongoose");
const fs = require("fs");
const util = require("util");
const path = require("path");
const MongoStore = require("connect-mongo");
const User = require("./user-model");
mongoose.connect("mongodb://localhost:27017/twitterbanner");
const getConfigForTwitterAPICall = require('./createRequest');
const { default: axios } = require("axios");
module.exports = function (job, done) {
  /**
   * parameters passed are user's id and bannersURLCounter
   * Using user's id, find the album urls, accessToken, tokenSecret,
   * Then call the Twitter API
   */
  console.log("Inside processing function...");
  const user = User.findById(job.data.userId).exec();

  user.then(async (user) => {
    /**
     * Here we have the user details now.
     * We can call the api here. We have all the data available.
     *
     */
    const album = user.albums.find((album) => album._id === job.data.albumId);
    const bannerImgPath =
      path.resolve(__dirname) + album[job.data.bannersURLsCounter];

    /**
     * Check if we've reached the end of the albums array.
     * If yes, set bannersURLsCounter to 0.
     * Else, bannersURLsCounter++;
     */
    if (job.data.bannersURLsCounter <= user.albums.length) {
      let baseURL = "https://api.twitter.com/1.1/account/update_profile_banner.json"
      getConfigForTwitterAPICall(process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET, user.authToken, user.tokenSecret, "POST", bannerImgPath, baseURL);
      // const readFile = util.promisify(fs.readFile);
      // const image = await readFile(
      //   "./uploads/2022-11-27T13:02:06.061ZfindYourStyle.png"
      // );
      try {
       /**
        * This is where we need to make the API call. Sign the signature and all that stuff...
        */
        response = axios(config);
        console.log(response.status);
      } catch (err) {
        console.log(err);
      }
      

      const result = {
        bannersURLsCounter: job.data.bannersURLsCounter + 1,
        frequency: album.frequencyOfUpdateInHours,
      };
      console.log("hello");
      done(null, result);
    } else {
      const result = {
        bannersURLsCounter: 0,
        frequency: album.frequencyOfUpdateInHours,
      };
      done(null, result);
    }
  });
};


