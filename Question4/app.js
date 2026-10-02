require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "question4-secret-key",
        resave: false,
        saveUninitialized: false
    })
);

mongoose.connect("mongodb://127.0.0.1:27017/ERPDB")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB Error:", err));

const employeeSchema = new mongoose.Schema({
    empid: {
        type: String,
        unique: true
    },
    name: String,
    email: String,
    password: String,
    basicSalary: Number,
    hra: Number,
    da: Number,
    grossSalary: Number
});

const Employee = mongoose.model("Employee", employeeSchema);

function checkAdmin(req, res, next) {
    if (req.session.admin) {
        next();
    } else {
        res.redirect("/login");
    }
}

function generateEmpId() {
    return "EMP" + Date.now();
}

function generatePassword() {
    return Math.random().toString(36).slice(-8);
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        req.session.admin = true;
        res.redirect("/employees");
    } else {
        res.render("login", {
            error: "Invalid admin username or password"
        });
    }
});

app.get("/employees", checkAdmin, async (req, res) => {
    const employees = await Employee.find();
    res.render("employees", { employees });
});

app.get("/employees/create", checkAdmin, (req, res) => {
    res.render("create");
});

app.post("/employees/create", checkAdmin, async (req, res) => {
    const {
        name,
        email,
        basicSalary
    } = req.body;

    const generatedPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const salary = Number(basicSalary);
    const hra = salary * 0.20;
    const da = salary * 0.10;
    const grossSalary = salary + hra + da;

    const employee = new Employee({
        empid: generateEmpId(),
        name,
        email,
        password: hashedPassword,
        basicSalary: salary,
        hra,
        da,
        grossSalary
    });

    await employee.save();

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "ERP Employee Account",
            text:
                `Employee ID: ${employee.empid}\n` +
                `Password: ${generatedPassword}\n` +
                `Gross Salary: ${grossSalary}`
        });
    } catch (error) {
        console.log("Email Error:", error.message);
    }

    res.redirect("/employees");
});

app.get("/employees/edit/:id", checkAdmin, async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    res.render("edit", { employee });
});

app.post("/employees/edit/:id", checkAdmin, async (req, res) => {
    const {
        name,
        email,
        basicSalary
    } = req.body;

    const salary = Number(basicSalary);
    const hra = salary * 0.20;
    const da = salary * 0.10;
    const grossSalary = salary + hra + da;

    await Employee.findByIdAndUpdate(req.params.id, {
        name,
        email,
        basicSalary: salary,
        hra,
        da,
        grossSalary
    });

    res.redirect("/employees");
});

app.get("/employees/delete/:id", checkAdmin, async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect("/employees");
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});