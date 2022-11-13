const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('./passport-setup')
const MongoStore = require('connect-mongo');

mongoose.connect("mongodb://localhost:27017/twitterbanner");



const app = express()

/**
 * Initialize session using the express-session library. Later, we'll set
 * the store value as well to save the session in our database.
 * 
 */

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*60*24, // one day 
        secure: "auto"
    },
    store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/twitterbanner'})

}));
app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());

app.get('/*', function(req, res, next) {
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
            message: "User has not been authenticated"
        });
    } else {
        next();
    }
}


app.get('/', (req, res, next) => {


    if (!req.user) {
        res.send("Welcome to the site...")
    } else {
        res.send(`Hello...${req.user.name}`)
    }
});

app.get('/logout', authCheck, (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }else {
            res.send("You have been logged out...")
        }
    });
    
})


app.get('/privileged-route', authCheck, (req, res, next) => {
    res.send("<h1>This is the privilege route</h1>")
})





app.get('/auth/twitter', passport.authenticate("twitter"));



app.get('/login-success', (req, res, next) => {
    
    res.redirect('/')
})

app.get('/login-fail', (req, res, next) => {
    
    res.send("Login failed");
})

app.get('/auth/twitter/callback', passport.authenticate("twitter", {
    successRedirect: "/login-success",
    failureRedirect: "/login-fail"
}));

app.use((error, req, res, next) => {
    console.log(error);
})

app.listen(8000, () => {
    console.log("Server is up and running at port 8000")
});

