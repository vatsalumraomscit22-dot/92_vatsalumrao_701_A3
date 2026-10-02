const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const redisClient = createClient({
    url: "redis://127.0.0.1:6379"
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

redisClient.connect().then(() => {
    console.log("Redis connected");
});

app.use(
    session({
        store: new RedisStore({
            client: redisClient
        }),
        secret: "question3-secret-key",
        resave: false,
        saveUninitialized: false
    })
);

app.get("/", (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        req.session.username = username;
        res.redirect("/home");
    } else {
        res.render("login", {
            error: "Invalid username or password"
        });
    }
});

function checkLogin(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.redirect("/");
    }
}

app.get("/home", checkLogin, (req, res) => {
    res.render("home", {
        username: req.session.username
    });
});

app.get("/profile", checkLogin, (req, res) => {
    res.render("profile", {
        username: req.session.username
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});