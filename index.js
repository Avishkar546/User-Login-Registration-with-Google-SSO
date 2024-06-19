import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { connectToDB } from "./src/DB_Connection/ConnectToDB.js";
import { initializeUserModel } from "./src/models/user.model.js";
import router from "./src/routes/user.route.js";


const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

// setup session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

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
