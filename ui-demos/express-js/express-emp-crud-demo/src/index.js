import express from "express";
import mongoose from "mongoose";
import employeeRoutes from "./routes/employee.routes.js";

const app = express();
const PORT = 3000;
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/ibm-ems")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use("/employees", employeeRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}.`);
});
