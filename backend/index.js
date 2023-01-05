const express = require("express");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./utils/passport-setup");
const MongoStore = require("connect-mongo");
mongoose.connect(process.env.MONGODB_URL);
const albumsRouter = require('./routes/albums');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const errorHandler = require('./middlewares/errorHandler');
const CLIENT_HOMEPAGE_URL = "http://localhost:3000";

const Agendash = require('agendash');
const agenda = require('./utils/agenda');

const app = express();

app.use(express.static(__dirname + "/uploads"));

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
      mongoUrl: process.env.MONGODB_URL,
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



const adminCheck = require('./middlewares/adminCheck');
const authCheck = require('./middlewares/authCheck');


app.use("/dash", authCheck, adminCheck, Agendash(agenda));

app.use("/admin", adminRouter);

// app.get("/admin", authCheck, adminCheck, (req, res, next) => {
//   res.json({message: "user is admin. "});
// })



app.get("/logout", authCheck, (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      res.send({ message: "userLoggedOut" });
    }
  });
});

app.use('/album', albumsRouter);


app.use('/auth', authRouter);


app.use(errorHandler);

app.listen(8000, () => {
  console.log("Server is up and running at port 8000");
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
