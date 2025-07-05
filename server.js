const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const session = require('express-session');
const mongoose=require('mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const MANGODB_URI='mongodb+srv://riddhika625:dbmango123M@riddhika.ku0xf.mongodb.net/?retryWrites=true&w=majority&appName=riddhika'

mongoose.connect(MANGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("mongodb connected"))
.catch((err)=>console.log(err))


// ✅ 1. Configure Google OAuth FIRST
const GOOGLE_CLIENT_ID = '758243983289-1l2hn2mhvcl4qk3eou56fnembp61o30q.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/google/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log("✅ Google Profile:", profile.displayName);
      return cb(null, profile);
    }
  )
);

// ✅ 2. Serialize/Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
  })
);

// ✅ 3. NOW define routes that use Google OAuth
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('✅ Google Login Successful');
  }
);

// Other routes
const summary = require('./backend/routes/summary');
const transcript = require('./backend/routes/transcript');
const translation = require('./backend/routes/translate');
const login=require('./backend/routes/login')
const history = require('./backend/routes/History');
const actionitems=require('./backend/routes/actionitems')
app.use('/api/history', history);
app.use('/api/getactionitems',actionitems)
app.use('/api/getsummary', summary);
app.use('/api/gettranscript', transcript);
app.use('/api/gettranslation', translation);
app.use('/api/login',login);
// Start server
app.listen(5000, () => console.log("✅ Server started on port 5000"));