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

const bannerChangeAPICallsQueue = new Queue("bannerChangeAPICallsQueue", process.env.REDIS_URL);
bannerChangeAPICallsQueue.on("error", (err) => console.log(err));

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [ new BullAdapter(bannerChangeAPICallsQueue)],
  serverAdapter: serverAdapter,
});





// someQueue.process(function(job, done) {
//     console.log(job.data);
//     done(null, job.data.nextCallAt);
// })

bannerChangeAPICallsQueue.process(function(job, done) {
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
    
    
});

/**
 * Event listener for the queue...
 * When a job gets completed, we add the next one with the delay value as a paramter.
 */
// someQueue.on('completed', function(job, result){
//     console.log("The job got completed.")
//     console.log(job);
//     console.log(result);
// }) 

bannerChangeAPICallsQueue.on('completed', function(job, result) {
    /**
     * Fetch the frequency of update section in the User database from the album
     * actually, we don't need the currentTime. Just get the frequency of update section.
     * and add a delay accordingly. 
     * Example. Say, frequency is 15 minutes.
     * delay = 1000 * 60 * 15 
     * for bannerURLsCounter value check if you have reached the end of the array. If yes, set the 
     * bannerURLsCounter to 0. 
     *  */ 
    console.log("Inside Completed Event");
    console.log("The userId is ");
    console.log(job.data.userId);
    console.log("The result is ")
    console.log(result);

    const delayTime = result.frequency * 1000 * 10 
    bannerChangeAPICallsQueue.add({userId: job.data.userId, bannersURLsCounter: result.bannersURLsCounter}, {delay: delayTime});
    
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

app.get("/test", (req, res, next) => {
  //    User.findById()
  console.log("testing");
  console.log(req.user);
  res.send({ name: "Satpreet" });
});

app.get("/privileged-route", authCheck, (req, res, next) => {
  res.send("<h1>This is the privilege route</h1>");
});

app.post(
  "/create-album",
  authCheck,
  upload.array("banners"),
  (req, res, next) => {
    console.log("Create Album was called. ");
    console.log(req.body.albumname);
    console.log(req.files[0].path);
    const bannersURLs = req.files.map((file) => {
      return file.path;
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
          console.log(error);
        } else {
          console.log(success);
        }
      }
    );

      /**
       * Add the job producer code here...
       */
    res.send("File received");
  }
);

app.post("/set-album", (req, res, next) => {
   
    // console.log(req.user);
    /**
     * pass albumName/id as a parameter. 
     * find the album from the user collection.
     * 
     * 
     * 
     * To make this call we need the following data of the user.
     * AccessToken, TokenSecret, bannersURLsCounter = 0,   
     */
    const userId = "6381aec9c99e41ffca669a4d"
    const bannersURLsCounter = 0;
    
    bannerChangeAPICallsQueue.add({userId: userId, bannersURLsCounter: bannersURLsCounter});
})


app.get("/auth/twitter", passport.authenticate("twitter"));

app.get("/login/success", (req, res, next) => {
  console.log("Here are the cookies...");
  console.log(req.cookies);
  if (req.user) {
    res.json({ user: req.user });
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

app.get("/image", (req, res, next) => {
  console.log("sending file...");
  res.sendFile(
    "/Users/satpreetmakhija/Documents/startups/twitter-banner-changer/backend/uploads/x"
  );
});

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
 *
 */
