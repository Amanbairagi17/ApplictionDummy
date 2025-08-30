-- Database migration script to add role column to pending_verification_user table
-- Run this script if you have an existing database without the role column

USE grabtitude;

-- Add role column to pending_verification_user table if it doesn't exist
ALTER TABLE pending_verification_user 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'USER' NOT NULL;

-- Update existing records to have USER role (if any exist)
UPDATE pending_verification_user SET role = 'USER' WHERE role IS NULL;

-- Verify the column was added
DESCRIBE pending_verification_user;
