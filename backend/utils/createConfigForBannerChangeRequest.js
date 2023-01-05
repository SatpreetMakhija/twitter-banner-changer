const oauthSignature = require("oauth-signature");

const FormData = require("form-data");
const fs = require("fs");

function getConfigForTwitterAPICall(
  consumerKey,
  consumerSecret,
  oauthToken,
  tokenSecret,
  httpMethodAllCaps,
  fileURL,
  baseURL
) {
  /**
   * This function creates the signature needed to add in the url.
   */
  var baseURL = baseURL;
  let httpMethod = httpMethodAllCaps;
  var parameters = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: require("crypto").randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: oauthToken,
    oauth_version: "1.0",
  };
  var consumerSecret = consumerSecret;
  var tokenSecret = tokenSecret;
  var signature = oauthSignature.generate(
    httpMethod,
    baseURL,
    parameters,
    consumerSecret,
    tokenSecret,
    { encodeSignature: true }
  );

  var data = new FormData();
  data.append("banner", fs.createReadStream(fileURL));

  let config = {
    method: "post",
    url:
      baseURL +
      "?" +
      "oauth_consumer_key=" +
      parameters.oauth_consumer_key +
      "&" +
      "oauth_token=" +
      parameters.oauth_token +
      "&" +
      "oauth_signature_method=" +
      parameters.oauth_signature_method +
      "&" +
      "oauth_timestamp=" +
      parameters.oauth_timestamp +
      "&" +
      "oauth_nonce=" +
      parameters.oauth_nonce +
      "&" +
      "oauth_version=" +
      parameters.oauth_version +
      "&" +
      "oauth_signature=" +
      signature,
    data: data,
  };

  return config;
}

module.exports = getConfigForTwitterAPICall;
// const axios = require('axios');
// // /**
// //  * Steps:
// //  * 1. Create Signature. Inputs: use ouath-signature to create the signature.
// //  * 2. Create the required Authorization header. Use @stdlib/string-percent-encode for help.
// //  * 3. Create FormData and append 'banner' variable to it with fs.createReadStream(<pathOfFile>)
// //  * 4. Prepare config variable for the post request via axios
// //  *
// //  *
// //  */

// // //Step 1
// var baseurl = "https://api.twitter.com/1.1/account/update_profile_banner.json"
// var httpMethod = "POST"
// var parameters = {
//     oauth_consumer_key : "8rItUQw2rCO3pxCPFHPvVV0mk",
//     oauth_nonce: require('crypto').randomBytes(16).toString('hex'),
//     oauth_signature_method: "HMAC-SHA1",
//     oauth_timestamp: Math.floor(Date.now()/1000).toString(),
//     //user's oauth_token
//     oauth_token: "1423630007310553093-NInp9RLjwty1qTOPPHjEAUZkZxQWdN",
//     oauth_version: "1.0"
// }
// var consumerSecret = "CusXxosRcFjQK1BPOVZNqHoAongraQBASVowWEWps1DnwigNnY"
// //user's tokenSecret
// var tokenSecret = "dqZQGlNRWUyhFCwncxKbhzMndfhVlPCVIWHHDKHSK4Hsi"
// var signature = oauthSignature.generate(httpMethod, baseurl, parameters, consumerSecret, tokenSecret, {encodeSignature: true});

// console.log(signature)

// var data = new FormData();
// data.append('banner', fs.createReadStream('/Users/satpreetmakhija/Documents/startups/twitter-banner-changer/backend/uploads/2022-11-27T13:02:06.067ZGrey White Minimalist Twitter Banner.png'));

// let config = {
//     method: 'post',
//     url : baseurl + '?' +'oauth_consumer_key=' + parameters.oauth_consumer_key + '&' +
//         'oauth_token=' + parameters.oauth_token + '&' +
//         'oauth_signature_method=' + parameters.oauth_signature_method + '&' +
//         'oauth_timestamp=' + parameters.oauth_timestamp + '&' +
//         'oauth_nonce=' + parameters.oauth_nonce + '&' +
//         'oauth_version=' + parameters.oauth_version + '&' +
//         'oauth_signature=' + signature,
//     data: data
// }

// axios(config).then((response) => console.log(response.status)).catch((err) => console.log(err));
