-- 1. Tell MySQL which database to use
USE food_reimbursements;

-- 2. Optional: Disable foreign key checks temporarily so we can clear the tables safely if we ever need to re-run this file
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE claims;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. Insert Top-Level Users (IT, Accounts, Admin Head, and the Manager)
-- We insert these first because they don't have a reporting manager (it is set to NULL).
INSERT INTO users (employee_id, name, email, password_hash, department, role, reporting_manager_id) VALUES
('IT-001', 'Ian Tech', 'it@company.com', '$2b$10$B5/B/.o/B/B/B/B/B/B/B/B.H.o.H.o.H.o.H.o.H.o.H.o.H.o.H.o', 'IT', 'IT_ADMIN', NULL),
('ACC-001', 'Alice Cash', 'accounts@company.com', '$2b$10$B5/B/.o/B/B/B/B/B/B/B/B.H.o.H.o.H.o.H.o.H.o.H.o.H.o.H.o', 'Finance', 'ACCOUNTS', NULL),
('ADM-001', 'Adam Head', 'admin@company.com', '$2b$10$B5/B/.o/B/B/B/B/B/B/B/B.H.o.H.o.H.o.H.o.H.o.H.o.H.o.H.o', 'Administration', 'ADMIN_HEAD', NULL),
('RM-001', 'Rachel Manager', 'manager@company.com', '$2b$10$B5/B/.o/B/B/B/B/B/B/B/B.H.o.H.o.H.o.H.o.H.o.H.o.H.o.H.o', 'Engineering', 'REPORTING_MANAGER', NULL);

-- 4. Insert Employees
-- Because Rachel Manager was the 4th user inserted above, her auto-incremented ID will be 4.
-- We assign reporting_manager_id = 4 to these employees so they report to Rachel.
INSERT INTO users (employee_id, name, email, password_hash, department, role, reporting_manager_id) VALUES
('EMP-001', 'Emma Worker', 'employee1@company.com', '$2b$10$B5/B/.o/B/B/B/B/B/B/B/B.H.o.H.o.H.o.H.o.H.o.H.o.H.o.H.o', 'Engineering', 'EMPLOYEE', 4),
('EMP-002', 'Eric Builder', 'employee2@company.com', '$2b$10$B5/B/.o/B/B/B/B/B/B/B/B.H.o.H.o.H.o.H.o.H.o.H.o.H.o.H.o', 'Engineering', 'EMPLOYEE', 4);

-- 5. (Optional) Insert a dummy claim just so you have some data to look at in the UI
-- Notice the user_id is 5, which corresponds to Emma Worker
INSERT INTO claims (claim_id, user_id, employee_id, employee_name, department, ot_date, time_in, time_out, amount_claimed, purpose, current_stage, status) VALUES
('CLM-1001', 5, 'EMP-001', 'Emma Worker', 'Engineering', '2023-10-25', '18:00:00', '21:00:00', 450.00, 'Late night project deployment dinner', 'REPORTING_MANAGER', 'PENDING');