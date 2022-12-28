const {default: mongoose} = require('mongoose');
const path = require('path');
const User = require('./user-model');
const getConfigForTwitterAPICall = require('./createConfigForBannerChangeRequest');
const {default: axios} = require('axios');



module.exports = function (job) {

    const albumId = job.attrs.data.albumId;
    const bannersURLsCounter = job.attrs.data.bannersURLsCounter;
    const userId = job.attrs.data.userId;
    const user = User.findById(userId).exec();
    user.then(async (user) => {
        const album = user.albums.find((album) => album._id.toString() === albumId);
        if (album) {
            const bannerImgPath =
        path.resolve(__dirname) + '/uploads/' +  album.bannersURLs[bannersURLsCounter];
        console.log(`Banner image path is ${bannerImgPath}`);
        let baseURL = "https://api.twitter.com/1.1/account/update_profile_banner.json"
        let accessToken = user.accessToken;
        let tokenSecret = user.tokenSecret;
        let config = getConfigForTwitterAPICall(process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET, accessToken, tokenSecret, "POST", bannerImgPath, baseURL);
        try {
            let response = await axios(config);
            console.log(response.status);
        } catch (err) {
            console.log(err);
        }
        } else {
            console.log("Such an album does not exist.");
        }
        

    //  /**
    //   * Check to set bannersURLsCounter to 0 if reached end of albums array.
    //   */
    // if (bannersURLsCounter <= user.albums.length + 1) {
    //     let baseURL = "https://api.twitter.com/1.1/account/update_profile_banner.json"
    //     let accessToken = user.accessToken;
    //     let tokenSecret = user.tokenSecret;
    //     let config = getConfigForTwitterAPICall(process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET, accessToken, tokenSecret, "POST", bannerImgPath, baseURL);
    //     try {
    //      /**
    //       * This is where we need to make the API call. Sign the signature and all that stuff...
    //       */
    //       let response = await axios(config);
    //       console.log(response);
    //     } catch (err) {
    //       console.log(err);
    //     }
        
  
    //     const result = {
    //       bannersURLsCounter: job.data.bannersURLsCounter + 1,
    //       frequency: album.frequencyOfUpdateInHours,
    //     };
    //     console.log("hello");
    //     done(null, result);
    //   } else {
    //     const result = {
    //       bannersURLsCounter: 0,
    //       frequency: album.frequencyOfUpdateInHours,
    //     };
    //     done(null, result);
    //   }

  
    })


}