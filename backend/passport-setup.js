const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('./user-model');
/**
 * 
 * serializeUser() is used to persist user data (after successful auth) into a session so that user data is not
 * lost if the user goes to a new page. If we don't persist user data in a session we have no clue whether the 
 * user is authenticated or not if they move to the next page.
 * done() is an internal function of passport. The second argument (user) is attached to the session as
 * req.session.passport.user = user
 * https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
 * 
 */

passport.serializeUser(function(user, done){
    // console.log(`[INFO]: SerializeUser function here with /n ${user.id}`);
    // console.log(user);
    done(null, user.id);
});

/**
 * deserializeUser() is used to find the user details from the session. (still not clear to me.)
 */

passport.deserializeUser(function(userId, done){
    /**\
     * user gets attached to the request as req.user
     */
   
    User.findById(userId, function(err, user) {
        console.log("here's some data")
        console.log(user);
        done(null, user);
    })
    
});

/**
 * This method is called when 'passport.authenticate()' method is called.
 * Returns the user object. This method then calls 'passport.serializeUser()' and 
 * adds the user to the 'req.session.passport' object. 
 * 
 */

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://www.localhost:8000/auth/twitter/callback",
    pkce: true,
    state: true,
},
    async function (token, tokenSecret, profile, done){
        /**
         * Function called after authentication returned from twitter with user details
         * attached to profile object.  
         * @params
         * token: oauth_token (use this token (attach to HTTP header) to prove you have user's permission)
         * tokenSecret: 
         * profile: user object
         * done: callback. Serializes the user. 
         * We'll later add the logic to add the user to the User database.
         */
       
        const currentUser = await User.findOne({
            twitterId: profile._json.id_str
        })
       
        //Creates a new user if the database doesn't have one already.
        if (!currentUser) {
            const newUser = await new User({
                name: profile._json.name,
                screenName: profile._json.screen_name,
                twitterId: profile._json.id_str,
                profileImageUrl: profile._json.profile_image_url,
                accessToken: token,
                tokenSecret: tokenSecret,
                currentAlbumInRotation: null
            }).save();
            console.log(newUser);
            if (newUser) {
                return done(null, newUser);
            }
        }

        return done(null, currentUser);

    }


))








