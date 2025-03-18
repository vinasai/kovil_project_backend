const mongoose = require('mongoose');

const FamilyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  relationship: { type: String, required: true }
});

const SignupSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  natchathiram: { type: String },
  raasi: { type: String },
  dob: { type: Date, required: true },
  address: { type: String },
  password: { type: String, required: true }, // Consider hashing!
  confirmpassword: { type: String, required: true },
  familyMembers: [FamilyMemberSchema],
}, { timestamps: true });

module.exports = mongoose.model('Signup', SignupSchema);
