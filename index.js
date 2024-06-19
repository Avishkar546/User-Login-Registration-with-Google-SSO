import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { connectToDB } from "./src/DB_Connection/ConnectToDB.js";
import { User, initializeUserModel } from "./src/models/user.model.js";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import router from "./src/routes/user.route.js";


const app = express();

dotenv.config();

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express.json());

// setup session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// Create google strategy
passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ["email", "profile"]
    },
        async (request, accesstoken, refreshtoken, profile, done) => {
            try {
                // Save user details in database if it's first time otherwise return user details.
                let user = await User.findOne({ where: { googleId: profile.id } });
                if (!user) {
                    user = await User.create({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        image: profile.photos[0].value
                    });
                }
                console.log(profile.emails[0].value);
                // console.log(profile.displayName);
                return done(null, profile);

            }
            catch (error) {
                console.log(error);
                return done(error, null)
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})

// initialize google oauth login
app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_URL}`,
    failureRedirect: `${process.env.CLIENT_URL}/login`
}))

app.get("/login/success", (req, res) => {
    if (req?.user) {
        res.status(201).json({
            success: true,
            user: req.user
        });
    } else {
        res.status(401).json({
            success: false,
            message: "User not logged in"
        });
    }
})

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect(`${process.env.CLIENT_URL}`);
    });
});

// user route configuration
app.use("/api/v1/user", router);

connectToDB();
initializeUserModel();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on PORT:${PORT}`);
});




