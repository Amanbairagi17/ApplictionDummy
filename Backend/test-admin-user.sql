-- Test script to verify admin user exists and can be used
-- Run this in MySQL to check if admin user is properly created

USE grabtitude;

-- Check if admin user exists
SELECT user_id, name, email, role, enabled, created_at 
FROM user 
WHERE email = 'admin@example.com';

-- Check if admin user has ADMIN role
SELECT user_id, name, email, role 
FROM user 
WHERE role = 'ADMIN';

-- Check all users in the system
SELECT user_id, name, email, role, enabled, created_at 
FROM user 
ORDER BY created_at DESC;

-- If admin user doesn't exist, create it manually:
-- INSERT INTO user (user_id, name, email, password, role, enabled, created_at) VALUES
-- ('admin-user-001', 'Admin User', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ADMIN', true, NOW());

-- Verify the password hash works (admin123)
-- The password "admin123" should hash to: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa

