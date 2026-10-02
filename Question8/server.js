const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize("studentdb", "root", "MySQL@1234", {
    host: "localhost",
    dialect: "mysql"
});

const Student = sequelize.define("Student", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

app.get("/", (req, res) => {
    res.send("Question 8 Student API is running");
});

app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.findAll();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch students" });
    }
});

app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: "Unable to add student" });
    }
});

app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        await student.update(req.body);
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: "Unable to update student" });
    }
});

app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        await student.destroy();
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Unable to delete student" });
    }
});

sequelize.sync()
    .then(() => {
        console.log("MySQL connected");
        console.log("Student table ready");

        app.listen(5003, () => {
            console.log("Server running at http://localhost:5003");
        });
    })
    .catch(error => {
        console.log("Database Error:", error);
    });