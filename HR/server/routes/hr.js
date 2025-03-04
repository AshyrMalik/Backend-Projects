const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Attendance, Overtime } = require('../models');
const { processExcelFile, cleanNumber } = require('../utils/fileProcessor');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const today = new Date().toISOString().split('T')[0];
        const uploadPath = path.join('uploads', today);
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/upload',
    upload.fields([
        { name: 'attendance', maxCount: 10 }, // Increased maxCount for multiple files
        { name: 'overtime', maxCount: 10 },   // Increased maxCount for multiple files
        { name: 'additional', maxCount: 5 }
    ]),
    async (req, res) => {
        try {
            if (!req.files.attendance || !req.files.overtime) {
                throw new Error('Both attendance and overtime files are required');
            }

            const today = new Date();
            let allAttendanceRecords = [];
            let allOvertimeRecords = [];

            // Process all attendance files
            for (const attendanceFile of req.files.attendance) {
                const attendanceData = processExcelFile(attendanceFile.path);
                const attendanceRecords = attendanceData.map(row => ({
                    submissionDate: today,
                    employeeNumber: row['S. #']?.toString(),
                    name: row['Name'] || '',
                    designation: row['Designation'] || '',
                    workingDays: cleanNumber(row['Working days']),
                    leaves: cleanNumber(row['Leaves']),
                    attendedDays: cleanNumber(row['Attended days']),
                    filePath: attendanceFile.path
                }));
                allAttendanceRecords = [...allAttendanceRecords, ...attendanceRecords];
            }

            // Process all overtime files
            for (const overtimeFile of req.files.overtime) {
                const overtimeData = processExcelFile(overtimeFile.path);
                const overtimeRecords = overtimeData.map(row => ({
                    submissionDate: today,
                    employeeNumber: row['S. #']?.toString(),
                    name: row['Name'] || '',
                    designation: row['Designation'] || '',
                    amount: cleanNumber(row['Amount']),
                    filePath: overtimeFile.path
                }));
                allOvertimeRecords = [...allOvertimeRecords, ...overtimeRecords];
            }

            // Validate data
            if (!allAttendanceRecords.length || !allOvertimeRecords.length) {
                throw new Error('No valid records found in the uploaded files');
            }

            // Additional validation
            const invalidAttendance = allAttendanceRecords.find(record => 
                isNaN(record.workingDays) || 
                isNaN(record.leaves) || 
                isNaN(record.attendedDays)
            );

            const invalidOvertime = allOvertimeRecords.find(record => 
                isNaN(record.amount)
            );

            if (invalidAttendance) {
                throw new Error('Invalid numeric values found in attendance data');
            }

            if (invalidOvertime) {
                throw new Error('Invalid numeric values found in overtime data');
            }

            // Save to database
            const savedAttendance = await Attendance.insertMany(allAttendanceRecords);
            const savedOvertime = await Overtime.insertMany(allOvertimeRecords);

            res.json({
                message: 'Files processed and data saved successfully',
                files: {
                    attendance: req.files.attendance.map(f => f.filename),
                    overtime: req.files.overtime.map(f => f.filename),
                    additional: req.files.additional ? req.files.additional.map(f => f.filename) : []
                },
                recordsCounts: {
                    attendance: savedAttendance.length,
                    overtime: savedOvertime.length
                }
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ 
                error: error.message,
                details: 'Check server logs for more information'
            });
        }
    }
);

module.exports = router;