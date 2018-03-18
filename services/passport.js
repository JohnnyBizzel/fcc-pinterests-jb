const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const User = mongoose.model('users');


passport.serializeUser((user, done) => {
  done(null, user.id); // null is for errors *ie none*; user.id gets the mongodb id
  // this is so if we use other auth providers we have a consistent user id coming from mongo.
});

passport.deserializeUser((id, done) => {
  // search DB for user
  User.findById(id).then(user => {
    done(null, user)});
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        // console.log('found Google user', profile);
        if (existingUser) {
          return done(null, existingUser);
        } else {
          new User({ googleId: profile.id, displayName: profile.displayName }).save()
          .then(user => done(null, user));
        }
      });
//     async (accessToken, refreshToken, profile, done) => {
//       const existingUser = await User.findOne({ googleId: profile.id });

//       const user = await new User({ googleId: profile.id }).save();
//       done(null, user);
//     }
    }
  )
);

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
  // console.log(profile);  
    User.findOne({ twitterId: profile.id }).then(existingUser => {
        if (existingUser) {
          return cb(null, existingUser);
        } else {
          new User({ twitterId: profile.id, displayName: profile.displayName }).save()
          .then(user => cb(null, user));
        }
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.HOST + "/auth/fb/callback"
  },
  function(token, tokenSecret, profile, cb) {
   // console.log(profile);
    User.findOne({ facebookId: profile.id }).then(existingUser => {
        if (existingUser) {
          return cb(null, existingUser);
        } else {
          new User({ facebookId: profile.id, displayName: profile.displayName }).save()
          .then(user => cb(null, user));
        }
    });
  }
));



passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/gh/callback"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOne({ githubId: profile.id }).then(existingUser => {
        // console.log(profile);      
        if (existingUser) {
          return cb(null, existingUser);
        } else {
          new User({ githubId: profile.id, displayName: profile.displayName }).save()
          .then(user => cb(null, user));
        }
    });
  }
));

