-- Add category column to problem table if it doesn't exist
ALTER TABLE problem ADD COLUMN IF NOT EXISTS category VARCHAR(255);

-- Update existing problems to have a default category if they don't have one
UPDATE problem SET category = 'General' WHERE category IS NULL OR category = '';
