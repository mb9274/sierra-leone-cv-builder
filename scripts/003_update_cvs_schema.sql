-- Update CVs table to make age nullable
-- This addresses the issue where age column might not exist or needs to be nullable

DO $$
BEGIN
    -- Check if the column exists and make it nullable if it does
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'cvs' 
        AND column_name = 'age'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.cvs ALTER COLUMN age DROP NOT NULL;
    ELSE
        -- Add the column as nullable if it doesn't exist
        ALTER TABLE public.cvs ADD COLUMN age integer NULL;
    END IF;
END $$;

-- Add a comment to document the change
COMMENT ON COLUMN public.cvs.age IS 'Age of the CV owner - nullable since it cannot be reliably extracted from PDFs';
