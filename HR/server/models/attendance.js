// models/attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
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
  workingDays: {
    type: Number,
    required: true
  },
  leaves: {
    type: Number,
    required: true
  },
  attendedDays: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
