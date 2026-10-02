const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const Employee = require("./models/Employee");
const Leave = require("./models/Leave");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/ERPDB")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB Error:", err));

const JWT_SECRET = "question5-secret-key";

app.get("/", (req, res) => {
    res.send("Question 5 Employee API is running");
});

app.post("/api/login", async (req, res) => {
    const { empid, password } = req.body;

    try {
        const employee = await Employee.findOne({ empid });

        if (!employee) {
            return res.status(401).json({
                message: "Invalid Employee ID or Password"
            });
        }

        const validPassword = await bcrypt.compare(password, employee.password);

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid Employee ID or Password"
            });
        }

        const token = jwt.sign(
            {
                id: employee._id,
                empid: employee.empid
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token
        });
    } catch (error) {
        console.log("Login Error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
});

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.employee = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

app.get("/api/profile", verifyToken, async (req, res) => {
    try {
        const employee = await Employee.findById(req.employee.id)
            .select("-password");

        res.json(employee);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

app.post("/api/leaves", verifyToken, async (req, res) => {
    const { date, reason, grant } = req.body;

    try {
        const leave = new Leave({
            employeeId: req.employee.id,
            date,
            reason,
            grant
        });

        await leave.save();

        res.json({
            message: "Leave application added successfully",
            leave
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to add leave application"
        });
    }
});

app.get("/api/leaves", verifyToken, async (req, res) => {
    try {
        const leaves = await Leave.find({
            employeeId: req.employee.id
        });

        res.json(leaves);
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch leave applications"
        });
    }
});

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});