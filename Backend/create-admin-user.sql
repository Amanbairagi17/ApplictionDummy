-- Create an admin user for testing admin functionality
-- Run this after the database initialization script

USE grabtitude;

-- Insert an admin user (password: admin123)
-- The password "admin123" hashes to this BCrypt value
INSERT INTO user (user_id, name, email, password, role, created_at, updated_at) VALUES
('admin-user-001', 'Admin User', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ADMIN', NOW(), NOW());

-- Verify the admin user was created
SELECT user_id, name, email, role, created_at FROM user WHERE email = 'admin@example.com';

-- Test credentials:
-- Email: admin@example.com
-- Password: admin123
-- Role: ADMIN
