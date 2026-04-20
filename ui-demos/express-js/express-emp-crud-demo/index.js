import express from "express";
import mongoose from "mongoose";
import employeeRoutes from "./routes/employee.routes.js";

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/employeeDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use("/employees", employeeRoutes);

// Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
