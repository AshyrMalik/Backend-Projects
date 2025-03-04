
// models/overtime.js
const mongoose = require('mongoose');

const overtimeSchema = new mongoose.Schema({
  submissionDate: {
    type: Date,
    required: true
  },
  employeeNumber: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Overtime', overtimeSchema);
