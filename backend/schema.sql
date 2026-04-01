CREATE DATABASE IF NOT EXISTS food_reimbursements;
USE food_reimbursements;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  department VARCHAR(80),
  role ENUM('EMPLOYEE','ADMIN_HEAD','REPORTING_MANAGER','ACCOUNTS','IT_ADMIN') NOT NULL,
  reporting_manager_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporting_manager_id) REFERENCES users(id)
);

CREATE TABLE claims (
  id INT AUTO_INCREMENT PRIMARY KEY,
  claim_id VARCHAR(20) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  employee_id VARCHAR(30) NOT NULL,
  employee_name VARCHAR(100) NOT NULL,
  department VARCHAR(80) NOT NULL,
  ot_date DATE NOT NULL,
  time_in TIME NOT NULL,
  time_out TIME NOT NULL,
  amount_claimed DECIMAL(10,2) NOT NULL,
  approved_amount DECIMAL(10,2) NULL,
  purpose TEXT,
  bill_path VARCHAR(255),
  current_stage ENUM('ADMIN_HEAD','REPORTING_MANAGER','ACCOUNTS') NULL,
  status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  approval_comment TEXT,
  rejection_comment TEXT,
  utr_reference VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
