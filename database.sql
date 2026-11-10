-- ============================================================
--  PerformX - Employee Performance Management System
--  MySQL Database Schema
--  Run this file in MySQL Workbench or phpMyAdmin
-- ============================================================

CREATE DATABASE IF NOT EXISTS performx;
USE performx;

-- -------------------------------------------------------
-- EMPLOYEES TABLE (core info + login)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,          -- e.g. PX-2024-001
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE NOT NULL,                       -- used for login password
    gender ENUM('Male','Female','Other'),
    photo_url TEXT,
    blood_group VARCHAR(5),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),

    -- Job Details
    department VARCHAR(100),
    designation VARCHAR(100),
    date_of_joining DATE,
    employment_type ENUM('Full-Time','Part-Time','Contract','Intern') DEFAULT 'Full-Time',
    status ENUM('Active','Inactive','Resigned') DEFAULT 'Active',

    -- Salary
    daily_rate DECIMAL(10,2) DEFAULT 1000.00,         -- salary per day (8 hrs)
    hourly_rate DECIMAL(10,2),                        -- auto-calculated

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------
-- EDUCATION TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20),
    degree VARCHAR(150),
    institution VARCHAR(200),
    board_university VARCHAR(200),
    year_of_passing YEAR,
    percentage_grade VARCHAR(20),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- WORK EXPERIENCE TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20),
    company_name VARCHAR(200),
    designation VARCHAR(150),
    start_date DATE,
    end_date DATE,
    years_of_experience DECIMAL(4,1),
    responsibilities TEXT,
    reason_for_leaving TEXT,
    feedback_from_company TEXT,                        -- previous company feedback
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- COMPANY HISTORY TABLE (history within current company)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20),
    event_type ENUM('Joined','Promoted','Department Change','Salary Hike','Warning','Award','Other'),
    description TEXT,
    effective_date DATE,
    recorded_by VARCHAR(100),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- ATTENDANCE TABLE (IN/OUT per day)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20),
    attendance_date DATE NOT NULL,
    first_in TIME,
    last_out TIME,
    working_hours DECIMAL(5,2),                        -- auto-calculated
    status ENUM('Present','Absent','Half Day','Late','On Leave') DEFAULT 'Present',
    notes TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    UNIQUE KEY unique_daily (employee_id, attendance_date)
);

-- -------------------------------------------------------
-- ATTENDANCE PUNCHES TABLE (multiple in/out per day)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance_punches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20),
    punch_date DATE NOT NULL,
    punch_time TIME NOT NULL,
    punch_type ENUM('IN','OUT') NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- SALARY RECORDS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS salary_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20),
    month_year VARCHAR(10),                            -- e.g. '2024-06'
    working_days INT DEFAULT 0,
    working_hours DECIMAL(7,2) DEFAULT 0,
    daily_rate DECIMAL(10,2),
    gross_salary DECIMAL(10,2),
    deductions DECIMAL(10,2) DEFAULT 0,
    net_salary DECIMAL(10,2),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- ADMIN TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------
-- SEED: Default Admin Account
-- Username: admin | Password: admin123
-- -------------------------------------------------------
INSERT IGNORE INTO admins (username, password, full_name)
VALUES ('admin', 'admin123', 'System Administrator');

-- -------------------------------------------------------
-- SAMPLE EMPLOYEE (for testing)
-- Employee ID: PX-2024-001
-- Login: PX-2024-001 / 2000 (birth year)
-- -------------------------------------------------------
INSERT IGNORE INTO employees (
    employee_id, first_name, last_name, email, phone, date_of_birth,
    gender, blood_group, address, city, state, pincode,
    department, designation, date_of_joining, employment_type, daily_rate
) VALUES (
    'PX-2024-001', 'Rahul', 'Sharma', 'rahul@example.com', '9876543210',
    '2000-05-15', 'Male', 'B+', '123 Main Street', 'Mumbai', 'Maharashtra', '400001',
    'Engineering', 'Software Developer', '2024-01-10', 'Full-Time', 1200.00
);

INSERT IGNORE INTO education (employee_id, degree, institution, board_university, year_of_passing, percentage_grade)
VALUES ('PX-2024-001', 'B.Tech Computer Science', 'Mumbai University', 'Mumbai University', 2022, '78%');

INSERT IGNORE INTO work_experience (employee_id, company_name, designation, start_date, end_date, years_of_experience, feedback_from_company)
VALUES ('PX-2024-001', 'TechStart Pvt Ltd', 'Junior Developer', '2022-06-01', '2023-12-31', 1.5, 'Hardworking and quick learner.');

INSERT IGNORE INTO company_history (employee_id, event_type, description, effective_date, recorded_by)
VALUES ('PX-2024-001', 'Joined', 'Joined as Software Developer in Engineering Dept.', '2024-01-10', 'admin');

-- ============================================================
-- Done! Run: USE performx; to verify tables.
-- ============================================================
