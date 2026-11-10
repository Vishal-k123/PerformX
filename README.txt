============================================================
  PerformX — Employee Performance Management System
  Setup Guide for VS Code
============================================================

HOW TO RUN THIS PROJECT IN VS CODE
====================================

STEP 1 — Install VS Code
   Download from: https://code.visualstudio.com/

STEP 2 — Install "Live Server" Extension
   • Open VS Code
   • Click Extensions icon on the left sidebar (or press Ctrl+Shift+X)
   • Search: Live Server
   • Click Install (by Ritwick Dey)

STEP 3 — Open the Project Folder
   • In VS Code → File → Open Folder
   • Select the PerformX folder

STEP 4 — Run the Project
   • Open the file: index.html
   • Right-click anywhere in the file
   • Click "Open with Live Server"
   • The browser opens automatically at http://127.0.0.1:5500

THAT'S IT! The project runs fully in the browser. No server needed.

============================================================

LOGIN DETAILS
==============

  ADMIN LOGIN:
    Username : admin
    Password : admin123

  EMPLOYEE LOGIN:
    Employee ID : PX-2024-001
    Birth Year  : 2000   (birth year is the password)

============================================================

PROJECT FILES
==============

  PerformX/
  ├── index.html                  ← Login Page (open this first)
  ├── css/
  │   └── style.css               ← All styles
  ├── js/
  │   └── app.js                  ← All JavaScript logic
  ├── pages/
  │   ├── dashboard.html          ← Admin Dashboard
  │   ├── employee-form.html      ← Add New Employee
  │   ├── employee-list.html      ← View All Employees
  │   ├── attendance.html         ← Punch IN / OUT
  │   ├── salary.html             ← Salary Calculator (Admin)
  │   └── employee-portal.html    ← Employee Self-Service
  ├── database.sql                ← MySQL schema (optional)
  └── README.txt                  ← This file

============================================================

FEATURES LIST
==============

  ADMIN:
  ✅ Add employees with full form (5 sections)
  ✅ Auto-generated Employee ID (PX-2024-001 format)
  ✅ Education details (multiple entries)
  ✅ Work experience with previous company feedback
  ✅ Company history tracking
  ✅ Daily rate / salary setup
  ✅ Punch IN / OUT for any employee
  ✅ View today's attendance
  ✅ Monthly attendance reports
  ✅ Salary calculator (by days or hours)
  ✅ Save salary records

  EMPLOYEE PORTAL:
  ✅ Login with Employee ID + Birth Year
  ✅ Self punch IN / OUT
  ✅ View own attendance history
  ✅ Calculate own salary
  ✅ View personal profile, education, experience

============================================================

SALARY FORMULA
==============

  Daily Rate  = Amount paid for 1 full day (8 hours)
  Hourly Rate = Daily Rate ÷ 8

  By Days:  Salary = Daily Rate × Working Days
  By Hours: Salary = Hourly Rate × Total Hours

  Example:
    Daily Rate = ₹1000
    Hourly Rate = ₹125
    26 days worked → ₹26,000
    208 hours worked → ₹26,000

============================================================

DATA STORAGE NOTE
==================

  This project uses the browser's Local Storage to save data.
  All data is saved in your browser automatically.
  No internet needed. No server needed. Works offline.

  If you want to use real MySQL database:
  → Run the database.sql file in MySQL Workbench
  → You will need to connect a backend (PHP or Node.js)
     to read/write from the database.

============================================================

MADE FOR: PerformX by a friend  ❤️
============================================================
