const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "profilePic") {
            cb(null, "uploads/profile");

        }
        else if (file.fieldname === "otherPics") {
            cb(null, "uploads/others");
        }
        else {
            cb(new Error("Unexpected file field"));
        }
    },
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() + "-" + file.originalname
        );
    }
});
const fileFilter = function (req, file, cb) {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png"
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(
            new Error(
                "Only JPG, JPEG and PNG files are allowed."
            )
        );
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: fileFilter
});
app.get("/", (req, res) => {
    res.render("register");
});
app.post(
    "/register",
    upload.fields([
        {
            name: "profilePic",
            maxCount: 1
        },
        {
            name: "otherPics",
            maxCount: 5
        }
    ]),
    (req, res) => {
        console.log("================================");
        console.log("FORM DATA");
        console.log("================================");
        console.log(req.body);
        console.log("================================");
        console.log("PROFILE PICTURE");
        console.log("================================");
        console.log(req.files.profilePic);
        console.log("================================");
        console.log("OTHER PICTURES");
        console.log("================================");
        console.log(req.files.otherPics);
        res.send(`
            <h1>Registration Successful</h1>
            <h3>Username: ${req.body.username}</h3>
            <h3>Email: ${req.body.email}</h3>
            <h3>Gender: ${req.body.gender}</h3>
            <h3>Hobbies: ${req.body.hobbies}</h3>
            <h3>
                Profile Picture:
                ${req.files.profilePic
                    ? req.files.profilePic[0].filename
                    : "No file"}
            </h3>
            <h3>
                Other Pictures:
                ${req.files.otherPics
                    ? req.files.otherPics.length
                    : 0}
            </h3>
            <br>
            <a href="/">
                Back to Registration
            </a>
        `);
    }
);
app.use((err, req, res, next) => {
    console.log("ERROR:", err.message);
    res.status(400).send(`
        <h1>Upload Error</h1>
        <p>${err.message}</p>
        <br>
        <a href="/">
            Back to Registration
        </a>
    `);
});
app.listen(3000, () => {
    console.log(
        "Server running at http://localhost:3000"
    );

});