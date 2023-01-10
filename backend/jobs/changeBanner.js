const {default: mongoose} = require('mongoose');
const path = require('path');
const User = require('../models/user-model');
const getConfigForTwitterAPICall = require('../utils/createConfigForBannerChangeRequest');
const {default: axios} = require('axios');
const config = require('../config');


module.exports = function(agenda) {
    agenda.define("change twitter banner", function (job, done) {
        const albumId = job.attrs.data.albumId;
        const bannersURLsCounter = job.attrs.data.bannersURLsCounter;
        const userId = job.attrs.data.userId;
        const user = User.findById(userId).exec();
        user.then(async (user) => {
            const album = user.albums.find((album) => album._id.toString() === albumId);
            if (album) {
                const bannerImgPath =
            path.resolve(__dirname, '..') + '/uploads/' +  album.bannersURLs[bannersURLsCounter];
            console.log(`Banner image path is ${bannerImgPath}`);
            let baseURL = "https://api.twitter.com/1.1/account/update_profile_banner.json"
            let accessToken = user.accessToken;
            let tokenSecret = user.tokenSecret;
            let configForApiCall = getConfigForTwitterAPICall(config.TWITTER_CONSUMER_KEY, config.TWITTER_CONSUMER_SECRET, accessToken, tokenSecret, "POST", bannerImgPath, baseURL);
            try {
                let response = await axios(configForApiCall);
                done();
                console.log(response.status);
            } catch (err) {
                job.fail('Twitter API call to change banner failed.')
                await job.save();
            }
            } else {
                job.fail('Album not found');
                await job.save();
            }
      
        })
    
    
    })
}
