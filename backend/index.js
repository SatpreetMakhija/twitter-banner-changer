const express = require("express");
const fs = require('fs');
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const multer = require("multer");
require("dotenv").config();
require("./passport-setup");
const axios = require('axios');
const MongoStore = require("connect-mongo");
const User = require("./user-model");
mongoose.connect("mongodb://localhost:27017/twitterbanner");

const CLIENT_HOMEPAGE_URL = "http://localhost:3000";

const Queue = require("bull");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const TwitterClient = require('twitter-api-client').TwitterClient;
const bannerChangeAPICallsQueue = new Queue("bannerChangeAPICallsQueue", process.env.REDIS_URL);
bannerChangeAPICallsQueue.on("error", (err) => console.log(err));


const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [ new BullAdapter(bannerChangeAPICallsQueue)],
  serverAdapter: serverAdapter,
});



bannerChangeAPICallsQueue.process('/Users/satpreetmakhija/Documents/startups/twitter-banner-changer/backend/processor.js');

bannerChangeAPICallsQueue.on('completed', function(job, result) {
  /**
   * Fetch frequency of update from user database. 
   * Use this value to add the next job in queue. 
   * 
   * 
   */
  console.log("on complete event trigerred")
  // const delayTime = 1000*5 //1 minute
  // bannerChangeAPICallsQueue.add({userId: job.data.userId, bannersURLsCounter: result.bannersURLsCounter, albumId: job.data.albumId}, {delay: delayTime});
}) 




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();

app.use(express.static(__dirname + '/uploads'));
app.use("/admin/queues", serverAdapter.getRouter());
app.use(bodyParser.json());
/**
 * Initialize session using the express-session library. Later, we'll set
 * the store value as well to save the session in our database.
 *
 */

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // one day
      secure: "auto",
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/twitterbanner",
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

//set up cors to allow requests from the client
app.use(
  cors({
    origin: "http://localhost:3000", //allow the server to accept request from a different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, //alow session cookie from browser to pass through
  })
);

app.use(cookieParser());

app.get("/*", function (req, res, next) {
  if (req.headers.host.match(/^www\./) != null) {
    res.redirect("http://" + req.headers.host.slice(4) + req.url, 301);
  } else {
    next();
  }
});

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.json({
      authentication: false,
      message: "User has not been authenticated",
    });
  } else {
    next();
  }
};

app.get("/", (req, res, next) => {
  if (!req.user) {
    res.send("Welcome to the site...");
  } else {
    res.send(`Hello...${req.user.name}`);
  }
});

app.get("/logout", authCheck, (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      res.send({ message: "userLoggedOut" });
    }
  });
});


app.post(
  "/create-album",
  authCheck,
  upload.array("banners"),
  (req, res, next) => {
    const bannersURLs = req.files.map((file) => {
      //slice to remove substring prefix 'uploads/' 
      return file.path.slice(8);
      
    });
    const album = {
      albumName: req.body.albumname,
      createdOn: new Date(),
      bannersURLs: bannersURLs,
      frequencyOfUpdateInHours: null
    };
    

    User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { albums: album } },
      function (error, success) {
        if (error) {
          res.status(500);
          res.send({message: "An error occured while creating the album"});
        } else {
          res.send({message: "Album created successfully"});
        }
      }
    );

      /**
       * Add the job producer code here...
       */
  }
);


app.delete("/delete-album", authCheck, (req, res, next) => {
  const albumId = req.body.albumId;
  //find the album with this id, if doesn't exist show you don't have an album with this id.
  // first delete images with the given url of the body. 
  // delete the album from the user's album and send the respnse. 
  const userId = req.user._id;
  User.findById(userId, async function(err, user) {
    if (err) {
      res.status(404);
      res.json({message: "Error. Could not find the user"});
    } else {
      const album = user.albums.find(album => album._id.toString() === albumId);
      if (album) {
        //for each bannersURLs, call fs.unlink.
        for (let i = 0 ; i < album.bannersURLs.length ; i++) {
          
          fs.unlink(process.cwd() + '/uploads/' + album.bannersURLs[i], (err) => {
            if (err) {
              console.log("Error occured.");
            }
          })
        }

        //remove the album from the user model.
        User.findOneAndUpdate({_id : userId},
          {$pull: {albums: {_id : albumId}}},
          function(error, success) {
            if (error) {
              res.status(404);
              res.json({message: "An error occured."});
            } else {
              res.status(200);
              res.send({messsage: "Album deleted successfully"});
            }
          })
      } else {
        res.status(404);
        res.json({message: "User does not have an album with this id."});
      }
    }
  })
})


app.post("/set-album", authCheck, async (req, res, next) => {
   
    const userId = req.user._id;
    const bannersURLsCounter = 0;
    const albumId = req.body.albumId;
    const bannerUpdateFrequency = req.body.bannerUpdateFrequency;

    //Find album in Users collection and set the frequencyOfUpdateInHours key's value to bannerUpdateFrequency obtained in req.body
    //Set user.currentAlbumIn Rotation to albumId; 
    //Add the album to the API Calls queue. 

    User.findById(userId, async function(err, user) {
      if (err) {
        next(err);
      } else {
        user.albums.find(album => album._id.toString() === albumId).frequencyOfUpdateInHours = Number(bannerUpdateFrequency);
        user.currentAlbumInRotation = String(albumId);
        await user.save();
        bannerChangeAPICallsQueue.add({userId: userId, bannersURLsCounter: bannersURLsCounter, albumId: albumId}).then(() => 
        res.send({"message": "Album set."}));
        
      }
    })    


    /**
     * 
     * This API call to change the banner works. KEEP THIS AS REFERENCE POINT
     */
    // const getConfigForTwitterAPICall = require('./createConfigForBannerChangeRequest');
    // const path = require("path");
    // let baseURL = "https://api.twitter.com/1.1/account/update_profile_banner.json";
    // const bannerImgPath =
    //   path.resolve(__dirname) + '/uploads/' +  "2022-12-06T12:32:11.492ZScreenshot 2022-12-06 at 1.40.18 PM.png"
    //   const accessToken = "1423630007310553093-NInp9RLjwty1qTOPPHjEAUZkZxQWdN";
    //   const tokenSecret = "dqZQGlNRWUyhFCwncxKbhzMndfhVlPCVIWHHDKHSK4Hsi";
    // let config = getConfigForTwitterAPICall(process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET, accessToken, tokenSecret, "POST", bannerImgPath, baseURL);
    // let response = await axios(config);
    // console.log(response);
})

app.get('/album/:albumid', authCheck, (req, res, next) => {
  const albumId = req.params.albumid;
  User.findById(req.user._id, (err, user) => {
    if (err) {
      console.log("Could not find a user with this user id");
    } else {
      let album = user.albums.find(album => album._id.toString() === albumId);
      if (album) {
        res.send({album: album});
      } else {
        res.status(404);
        res.send({message: "You don't have an album with this id"});
      }
     
    }
  })
})

app.get("/auth/twitter", passport.authenticate("twitter"));

app.get("/login/success", (req, res, next) => {
  if (req.user) {
    let user = {
      name: req.user.name,
      profileImageUrl: req.user.profileImageUrl,
      id: req.user._id,
      albums: req.user.albums
    }
    res.json({ user: user });
  } else {
    console.log("user is NOT found");
    res.status(201);
    res.status({ message: "No user found" });
  }
  next();
});

app.get("/login-success", (req, res, next) => {
  res.redirect(CLIENT_HOMEPAGE_URL);
});

app.get("/login-fail", (req, res, next) => {
  res.send("Login failed");
});

//redirect to /login-success after successfully login via Twitter.
app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "/login-success",
    failureRedirect: "/login-fail",
  })
);



app.use((error, req, res, next) => {
  console.log(error);
  next();
});

app.listen(8000, () => {
  console.log("Server is up and running at port 8000");
  console.log("for Bull UI, open http://localhost:8000/admin/queues");
});

/**
 * Information on what these libraries do..
 * 1. Multer: handle form-data type of POST methods. Basically, for handling file uploads via forms.
 * 2. cors: allows cross site access. Backend accepts request from frontend.
 * 3. Express-session: handle sessions for users.
 * 4. passport: works in sync with express-session to keep the user authenticated by serializing and deserializing.
 * 5. cookie-Parser: parses cookies present in the request.
 * 6. Bull: allows us to connect to redis database and use a queueu, worker, create jobs. 
 *
 */
