-- Create the whitelist table
CREATE TABLE IF NOT EXISTS public.whitelist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    paid BOOLEAN DEFAULT false NOT NULL,
    status TEXT DEFAULT 'inactive',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.whitelist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read the whitelist (needed for login check)
-- In a stricter environment, you might only allow reading specific rows, but for this simple check it's okay.
CREATE POLICY "Allow public read access to whitelist" 
ON public.whitelist 
FOR SELECT 
USING (true);

-- Create policy to allow service role to insert/update (used by the webhook)
CREATE POLICY "Allow service role to manage whitelist" 
ON public.whitelist 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_whitelist_updated_at
    BEFORE UPDATE ON public.whitelist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert a test user (optional, for testing before real payments)
-- INSERT INTO public.whitelist (email, paid) VALUES ('seu-email@exemplo.com', true);
