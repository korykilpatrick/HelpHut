-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--------------------------------------------------------------------------------
-- Drop existing tables in correct dependency order
--------------------------------------------------------------------------------
DROP TABLE IF EXISTS shifts CASCADE;
DROP TABLE IF EXISTS donation_items CASCADE;
DROP TABLE IF EXISTS volunteer_availability_time CASCADE;
DROP TABLE IF EXISTS volunteer_availability_zones CASCADE;
DROP TABLE IF EXISTS volunteer_skills CASCADE;
DROP TABLE IF EXISTS ticket_tags CASCADE;
DROP TABLE IF EXISTS ticket_attachments CASCADE;
DROP TABLE IF EXISTS ticket_notes CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS food_types CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS donors CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

--------------------------------------------------------------------------------
-- Drop custom ENUM types if needed
--------------------------------------------------------------------------------
DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS ticket_priority CASCADE;
DROP TYPE IF EXISTS inventory_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

--------------------------------------------------------------------------------
-- Recreate ENUM Types
--------------------------------------------------------------------------------
CREATE TYPE ticket_status AS ENUM (
  'Submitted',
  'Scheduled',
  'InTransit',
  'Delivered',
  'Completed'
);

CREATE TYPE ticket_priority AS ENUM (
  'Urgent',
  'Routine'
);

CREATE TYPE inventory_status AS ENUM (
  'Available',
  'Reserved',
  'Distributed'
);

CREATE TYPE user_role AS ENUM (
  'Admin',
  'Donor',
  'Volunteer',
  'Partner'
);

--------------------------------------------------------------------------------
-- Locations (centralized addresses & geolocation)
--------------------------------------------------------------------------------
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Users (centralized authentication and roles)
--------------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE CHECK (email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'),
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Donors Table
--------------------------------------------------------------------------------
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  name TEXT NOT NULL,
  contact_email TEXT NOT NULL CHECK (contact_email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'),
  contact_phone TEXT NOT NULL CHECK (contact_phone ~* '^[0-9+\\-\\(\\)\\s]{7,}$'),
  business_hours TEXT,
  pickup_preferences TEXT,
  location_id UUID REFERENCES locations(id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Volunteers Table
--------------------------------------------------------------------------------
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'),
  phone TEXT NOT NULL CHECK (phone ~* '^[0-9+\\-\\(\\)\\s]{7,}$'),
  vehicle_type TEXT,
  location_id UUID REFERENCES locations(id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Partners Table
--------------------------------------------------------------------------------
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  name TEXT NOT NULL,
  max_capacity INT DEFAULT 0 CHECK (max_capacity >= 0),
  capacity INT DEFAULT 0 CHECK (capacity >= 0),
  contact_email TEXT NOT NULL CHECK (contact_email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'),
  contact_phone TEXT NOT NULL CHECK (contact_phone ~* '^[0-9+\\-\\(\\)\\s]{7,}$'),
  location_id UUID REFERENCES locations(id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Food Types (reference table to standardize naming)
--------------------------------------------------------------------------------
CREATE TABLE food_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Donations Table (tracks each donor-submitted donation event)
--------------------------------------------------------------------------------
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES donors(id) ON UPDATE CASCADE ON DELETE SET NULL,
  donated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Donation Items Table (links a single donation to multiple food items)
--------------------------------------------------------------------------------
CREATE TABLE donation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES donations(id) ON UPDATE CASCADE ON DELETE CASCADE,
  food_type_id UUID REFERENCES food_types(id) ON UPDATE CASCADE ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unit TEXT NOT NULL DEFAULT 'lbs',
  expiration_date TIMESTAMPTZ,
  storage_requirements TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Tickets Table (manages the rescue workflow for a donation)
--------------------------------------------------------------------------------
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID REFERENCES donations(id) ON UPDATE CASCADE ON DELETE SET NULL,
  status ticket_status NOT NULL DEFAULT 'Submitted',
  priority ticket_priority NOT NULL DEFAULT 'Routine',
  volunteer_id UUID REFERENCES volunteers(id) ON UPDATE CASCADE ON DELETE SET NULL,
  partner_org_id UUID REFERENCES partners(id) ON UPDATE CASCADE ON DELETE SET NULL,
  pickup_location_id UUID REFERENCES locations(id) ON UPDATE CASCADE ON DELETE SET NULL,
  dropoff_location_id UUID REFERENCES locations(id) ON UPDATE CASCADE ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Ticket-related Sub-Tables: tags, attachments, notes
--------------------------------------------------------------------------------
CREATE TABLE ticket_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON UPDATE CASCADE ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON UPDATE CASCADE ON DELETE CASCADE,
  attachment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON UPDATE CASCADE ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Inventory Table (now references donation_items for traceability)
--------------------------------------------------------------------------------
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_item_id UUID REFERENCES donation_items(id) ON UPDATE CASCADE ON DELETE SET NULL,
  food_type_id UUID REFERENCES food_types(id) ON UPDATE CASCADE ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unit TEXT NOT NULL DEFAULT 'lbs',
  expiration_date TIMESTAMPTZ,
  partner_org_id UUID REFERENCES partners(id) ON UPDATE CASCADE ON DELETE SET NULL,
  status inventory_status NOT NULL DEFAULT 'Available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Volunteer Availability & Skills
--------------------------------------------------------------------------------
CREATE TABLE volunteer_availability_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON UPDATE CASCADE ON DELETE CASCADE,
  zone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_volunteer_zone UNIQUE (volunteer_id, zone)
);

CREATE TABLE volunteer_availability_time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON UPDATE CASCADE ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_volunteer_time UNIQUE (volunteer_id, day_of_week, start_time, end_time)
);

CREATE TABLE volunteer_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON UPDATE CASCADE ON DELETE CASCADE,
  skill TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Activity Logs (for auditing and accountability)
--------------------------------------------------------------------------------
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Shifts (for scheduling volunteers)
--------------------------------------------------------------------------------
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON UPDATE CASCADE ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- Timestamp Trigger Function
--------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS set_update_timestamp() CASCADE;
CREATE OR REPLACE FUNCTION set_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--------------------------------------------------------------------------------
-- User-Role Consistency
-- Each trigger checks that the linked user has the correct role for the table
--------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS check_donor_user_role() CASCADE;
CREATE OR REPLACE FUNCTION check_donor_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    IF (SELECT role FROM users WHERE id = NEW.user_id) != 'Donor' THEN
      RAISE EXCEPTION 'User role must be Donor for donors table entry.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_check_donor_user_role
BEFORE INSERT OR UPDATE ON donors
FOR EACH ROW
EXECUTE PROCEDURE check_donor_user_role();

DROP FUNCTION IF EXISTS check_volunteer_user_role() CASCADE;
CREATE OR REPLACE FUNCTION check_volunteer_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    IF (SELECT role FROM users WHERE id = NEW.user_id) != 'Volunteer' THEN
      RAISE EXCEPTION 'User role must be Volunteer for volunteers table entry.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_check_volunteer_user_role
BEFORE INSERT OR UPDATE ON volunteers
FOR EACH ROW
EXECUTE PROCEDURE check_volunteer_user_role();

DROP FUNCTION IF EXISTS check_partner_user_role() CASCADE;
CREATE OR REPLACE FUNCTION check_partner_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    IF (SELECT role FROM users WHERE id = NEW.user_id) != 'Partner' THEN
      RAISE EXCEPTION 'User role must be Partner for partners table entry.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_check_partner_user_role
BEFORE INSERT OR UPDATE ON partners
FOR EACH ROW
EXECUTE PROCEDURE check_partner_user_role();

--------------------------------------------------------------------------------
-- Single Trigger Creation (Shared Naming) for set_update_timestamp
--------------------------------------------------------------------------------
DO $$
DECLARE
  tbl_name TEXT;
BEGIN
  FOR tbl_name IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = current_schema()
      AND tablename IN (
        'locations','users','donors','volunteers','partners','food_types','donations',
        'donation_items','tickets','ticket_tags','ticket_attachments','ticket_notes',
        'inventory','volunteer_availability_zones','volunteer_availability_time',
        'volunteer_skills','activity_logs','shifts'
      )
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS tgr_set_updated_at ON %I', tbl_name);
    EXECUTE format('CREATE TRIGGER tgr_set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE set_update_timestamp()', tbl_name);
  END LOOP;
END;
$$;

--------------------------------------------------------------------------------
-- Indexing Strategy
--------------------------------------------------------------------------------

-- Tickets
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets (status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets (priority);
CREATE INDEX IF NOT EXISTS idx_tickets_status_priority ON tickets (status, priority);
CREATE INDEX IF NOT EXISTS idx_tickets_volunteer_id ON tickets (volunteer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_partner_org_id ON tickets (partner_org_id);

-- Partial index for "active" tickets
CREATE INDEX IF NOT EXISTS idx_tickets_active
  ON tickets (status)
  WHERE status != 'Completed';

-- Inventory
CREATE INDEX IF NOT EXISTS idx_inventory_partner_org_id ON inventory (partner_org_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory (status);

-- Donations
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);

-- Donation Items
CREATE INDEX IF NOT EXISTS idx_donation_items_donation_id ON donation_items(donation_id);
CREATE INDEX IF NOT EXISTS idx_donation_items_food_type_id ON donation_items(food_type_id);

-- End of db.sql
