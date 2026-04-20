import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  age: Number,
  departmentId: String,
  roleId: String,
  projectIds: [String],
  salary: Number,
  joiningDate: Date,
  status: String,
  skills: [String],
  performanceScore: Number,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  isRemote: Boolean,
  certifications: [String],
  managerApproval: Boolean
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);
