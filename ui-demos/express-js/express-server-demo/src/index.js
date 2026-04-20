// // index.js 
// console.log("Starting...");
// import express from 'express';
// const app = express();
// // accepts GET requests // create more endpoints 
// app.get("endpoint", () => {});
// // accepts POST requests // create more endpoints 
// app.post();
// // starts the express server 
// app.listen(PORT, () => {});

// index.js 
console.log("Starting...");

import express from 'express';
import mongoose, { Mongoose } from 'mongoose';

const app = express();
const PORT = 3000;

app.use(express.json());

// connect to MongoDB server 
mongoose.connect("mongodb://localhost:27017/ibm-ems")
    .then(() => { console.log("Connected to MongoDB."); })
    .catch((err) => { console.log(err); });

// Schema object to store employee data 
const employeeSchema = new mongoose.Schema();

// Employee object based on the above schema 
const Employee = mongoose.model("Employee", employeeSchema);

// http://localhost:3000/employees
app.get("/employees", async (req, res) => {
    console.log("employees");
    try {
        const employeeList = await Employee.find();
        res.json(employeeList);
    }
    catch (err) {
        console.log(err);
    };
});

// http://localhost:3000/employees
app.post("/employees", async (req, res) => {
    console.log("add new employee");
    console.log(req.body);
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.send("Employee added successfully!")
    }
    catch (err) {
        console.log(err);
    };
});

// http://localhost:3000/hello
app.get("/hello", (req, res) => {
    console.log("hello");
    res.send("Hello world!");
});

// http://localhost:3000/hi
app.get("/hi", (req, res) => {
    console.log("hi");
    res.send("Hi! How're you?");
});

// http://localhost:3000
app.get("/", (req, res) => {
    console.log("welcome");
    res.send("Welcome!");
});

// starts the express server 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});