const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: path.resolve(__dirname,  `${process.env.NODE_ENV}.env`)});


console.log(process.env.NODE_ENV)
module.exports = {
    MONGODB_URL: process.env.MONGODB_URL,
    TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
    PORT: process.env.PORT,
    HOST: process.env.HOST
}