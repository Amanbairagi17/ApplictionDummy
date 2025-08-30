-- Create a test user for testing login functionality
-- Run this after the database initialization script

USE grabtitude;

-- Insert a test user (password: test123)
-- The password will be encrypted by BCrypt when the user is created through the registration process
-- For now, let's create a user directly in the user table with an encrypted password

-- First, let's create a test user with a known BCrypt hash
-- The password "test123" hashes to this BCrypt value
INSERT INTO user (user_id, name, email, password, role, created_at, updated_at) VALUES 
('test-user-001', 'Test User', 'test@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'USER', NOW(), NOW());

-- Verify the user was created
SELECT user_id, name, email, role, created_at FROM user WHERE email = 'test@example.com';

-- Test credentials:
-- Email: test@example.com
-- Password: test123
