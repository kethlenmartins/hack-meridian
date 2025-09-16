-- Supabase Database Schema for Farm Investment Platform
-- This file contains the SQL schema to be executed in your Supabase project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create farmers table
CREATE TABLE IF NOT EXISTS farmers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    address_street TEXT NOT NULL,
    address_number TEXT NOT NULL,
    address_complement TEXT,
    address_neighborhood TEXT NOT NULL,
    address_city TEXT NOT NULL,
    address_state TEXT NOT NULL,
    address_zip_code TEXT NOT NULL,
    address_country TEXT DEFAULT 'Brasil',
    farm_experience INTEGER NOT NULL,
    certifications TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create farms table
CREATE TABLE IF NOT EXISTS farms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    total_area DECIMAL(10, 2) NOT NULL,
    arable_area DECIMAL(10, 2) NOT NULL,
    soil_type TEXT NOT NULL CHECK (soil_type IN ('argiloso', 'arenoso', 'misto', 'calcario', 'humifero')),
    irrigation_system TEXT NOT NULL CHECK (irrigation_system IN ('pivo_central', 'gotejamento', 'aspersao', 'sulcos', 'manual', 'nenhum')),
    certifications TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crops table
CREATE TABLE IF NOT EXISTS crops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    variety TEXT NOT NULL,
    planting_date DATE NOT NULL,
    expected_harvest_date DATE NOT NULL,
    area DECIMAL(10, 2) NOT NULL,
    expected_yield DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'planted' CHECK (status IN ('planned', 'planted', 'growing', 'ready_for_harvest', 'harvested', 'failed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investors table
CREATE TABLE IF NOT EXISTS investors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    address_street TEXT NOT NULL,
    address_number TEXT NOT NULL,
    address_complement TEXT,
    address_neighborhood TEXT NOT NULL,
    address_city TEXT NOT NULL,
    address_state TEXT NOT NULL,
    address_zip_code TEXT NOT NULL,
    address_country TEXT DEFAULT 'Brasil',
    risk_profile TEXT NOT NULL CHECK (risk_profile IN ('conservative', 'moderate', 'aggressive')),
    investment_experience INTEGER NOT NULL,
    annual_income DECIMAL(15, 2) NOT NULL,
    net_worth DECIMAL(15, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    investor_id UUID REFERENCES investors(id) ON DELETE CASCADE NOT NULL,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    expected_return DECIMAL(5, 2) NOT NULL,
    expected_duration INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    actual_return DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create files table for file metadata
CREATE TABLE IF NOT EXISTS files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('farmer', 'investor')),
    original_name TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    public_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_farmers_email ON farmers(email);
CREATE INDEX IF NOT EXISTS idx_farmers_cpf ON farmers(cpf);
CREATE INDEX IF NOT EXISTS idx_farmers_state ON farmers(address_state);
CREATE INDEX IF NOT EXISTS idx_farms_farmer_id ON farms(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farms_state ON farms(state);
CREATE INDEX IF NOT EXISTS idx_crops_farm_id ON crops(farm_id);
CREATE INDEX IF NOT EXISTS idx_crops_status ON crops(status);
CREATE INDEX IF NOT EXISTS idx_investors_email ON investors(email);
CREATE INDEX IF NOT EXISTS idx_investors_cpf ON investors(cpf);
CREATE INDEX IF NOT EXISTS idx_investments_investor_id ON investments(investor_id);
CREATE INDEX IF NOT EXISTS idx_investments_farm_id ON investments(farm_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_farmers_updated_at 
    BEFORE UPDATE ON farmers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_farms_updated_at 
    BEFORE UPDATE ON farms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crops_updated_at 
    BEFORE UPDATE ON crops 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investors_updated_at 
    BEFORE UPDATE ON investors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at 
    BEFORE UPDATE ON investments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at 
    BEFORE UPDATE ON files 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Farmers policies
CREATE POLICY "Farmers can view their own data" ON farmers
    FOR SELECT USING (true); -- Allow public read for now

CREATE POLICY "Farmers can update their own data" ON farmers
    FOR UPDATE USING (true); -- Allow public update for now

CREATE POLICY "Farmers can insert their own data" ON farmers
    FOR INSERT WITH CHECK (true); -- Allow public insert for now

-- Farms policies
CREATE POLICY "Anyone can view farms" ON farms
    FOR SELECT USING (true);

CREATE POLICY "Farmers can manage their own farms" ON farms
    FOR ALL USING (true); -- Allow public access for now

-- Crops policies
CREATE POLICY "Anyone can view crops" ON crops
    FOR SELECT USING (true);

CREATE POLICY "Farmers can manage crops on their farms" ON crops
    FOR ALL USING (true); -- Allow public access for now

-- Investors policies
CREATE POLICY "Investors can view their own data" ON investors
    FOR SELECT USING (true); -- Allow public read for now

CREATE POLICY "Investors can update their own data" ON investors
    FOR UPDATE USING (true); -- Allow public update for now

CREATE POLICY "Investors can insert their own data" ON investors
    FOR INSERT WITH CHECK (true); -- Allow public insert for now

-- Investments policies
CREATE POLICY "Investors can view their own investments" ON investments
    FOR SELECT USING (true); -- Allow public read for now

CREATE POLICY "Investors can manage their own investments" ON investments
    FOR ALL USING (true); -- Allow public access for now

-- Files policies
CREATE POLICY "Users can view their own files" ON files
    FOR SELECT USING (true); -- Allow public read for now

CREATE POLICY "Users can manage their own files" ON files
    FOR ALL USING (true); -- Allow public access for now

-- Create storage bucket for files (this needs to be done in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('farm-investment-files', 'farm-investment-files', true);

-- Storage policies (these need to be created in Supabase dashboard or via API)
-- CREATE POLICY "Users can upload their own files" ON storage.objects
--     FOR INSERT WITH CHECK (true);

-- CREATE POLICY "Users can view their own files" ON storage.objects
--     FOR SELECT USING (true);

-- CREATE POLICY "Users can delete their own files" ON storage.objects
--     FOR DELETE USING (true);
