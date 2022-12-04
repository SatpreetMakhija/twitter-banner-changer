const express = require("express");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const multer = require("multer");
require("dotenv").config();
require("./passport-setup");
const MongoStore = require("connect-mongo");
const User = require("./user-model");
mongoose.connect("mongodb://localhost:27017/twitterbanner");

const CLIENT_HOMEPAGE_URL = "http://localhost:3000";

const Queue = require("bull");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const TwitterClient = require('twitter-api-client').TwitterClient;
console.log(typeof(TwitterClient))
const bannerChangeAPICallsQueue = new Queue("bannerChangeAPICallsQueue", process.env.REDIS_URL);
bannerChangeAPICallsQueue.on("error", (err) => console.log(err));


const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [ new BullAdapter(bannerChangeAPICallsQueue)],
  serverAdapter: serverAdapter,
});



bannerChangeAPICallsQueue.process('/Users/satpreetmakhija/Documents/startups/twitter-banner-changer/backend/processor.js');


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
  console.log("auth check was called..", req.user);
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
    console.log("Create Album was called. ");
    const bannersURLs = req.files.map((file) => {
      //slice to remove substring prefix 'uploads/' 
      return file.path.slice(8);
      
    });
    const album = {
      albumName: req.body.albumname,
      createdOn: new Date(),
      bannersURLs: bannersURLs,
      frequencyOfUpdateInHours: req.body.frequency,
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

app.post("/set-album", async (req, res, next) => {
   
    // console.log(req.user);
    /**
     * pass albumName/id as a parameter. 
     * find the album from the user collection.
     * Set the attribute current_album_id to the album_id you get in the req object. 
     * 
     * 
     * 
     * To make this call we need the following data of the user.
     * AccessToken, TokenSecret, bannersURLsCounter = 0,   
     */
    const userId = "6381aec9c99e41ffca669a4d"
    const bannersURLsCounter = 0;
    const albumId = "63835fcee310d04eee93326c";
    bannerChangeAPICallsQueue.add({userId: userId, bannersURLsCounter: bannersURLsCounter, albumId: albumId});
    
    res.send({"message": "Album set."});
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
        res.send({message: "You don't have an album with this id"});
      }
     
    }
  })
})

app.get("/auth/twitter", passport.authenticate("twitter"));

app.get("/login/success", (req, res, next) => {
  console.log("Here are the cookies...");
  console.log(req.cookies);
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
