const mongoose = require('mongoose');

// Define the schema for family members
const FamilyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the family member
  dob: { type: Date, required: true }, // Date of birth of the family member
  relationship: { type: String, required: true }, // Relationship with the user
});

// Define the schema for the user
const SignupSchema = new mongoose.Schema({
  firstname: { type: String, required: true }, // User's first name
  lastname: { type: String, required: true }, // User's last name
  dob: { type: Date, required: true }, // User's date of birth
  address: { type: String, required: true }, // User's address
  email: { type: String, required: true, unique: true }, // User's email
  password: { type: String, required: true }, // Hashed password
  familyMembers: [FamilyMemberSchema], // Array of family members
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Create and export the model
module.exports = mongoose.model('Signup', SignupSchema);