const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    empid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    basicSalary: Number,
    hra: Number,
    da: Number,
    grossSalary: Number
});

module.exports = mongoose.model("Employee", employeeSchema);