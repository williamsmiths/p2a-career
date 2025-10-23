-- P2A Career Module Slave Database Initialization
-- This script runs when PostgreSQL Slave container starts for the first time

-- Set timezone to UTC
SET timezone = 'UTC';

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enums for Career Module (same as master)
DO $$ BEGIN
    CREATE TYPE company_type AS ENUM ('enterprise', 'business_household');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('pending', 'approved', 'rejected', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'internship', 'contract');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('submitted', 'cv_viewed', 'cv_approved', 'interviewing', 'offered', 'hired', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create companies table (read-only replica)
CREATE TABLE IF NOT EXISTS "companies" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID UNIQUE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tax_id" VARCHAR(50) UNIQUE,
    "company_type" company_type NOT NULL DEFAULT 'enterprise',
    "verification_status" verification_status NOT NULL DEFAULT 'unverified',
    "company_size_id" INT,
    "website" TEXT,
    "description" TEXT,
    "contact_email" VARCHAR(255),
    "contact_phone" VARCHAR(50),
    "city_id" INT,
    "street_address" TEXT,
    "logo_url" TEXT,
    "banner_url" TEXT,
    "working_days" VARCHAR(255),
    "overtime_policy" TEXT,
    "company_culture_photos" JSONB,
    "why_you_love_working_here" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Create jobs table (read-only replica)
CREATE TABLE IF NOT EXISTS "jobs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "salary_min" INT,
    "salary_max" INT,
    "job_type" job_type NOT NULL,
    "status" job_status NOT NULL DEFAULT 'pending',
    "deadline" TIMESTAMPTZ,
    "city_id" INT,
    "position_level_id" INT,
    "experience_level_id" INT,
    "is_remote" BOOLEAN DEFAULT false,
    "is_urgent" BOOLEAN DEFAULT false,
    "view_count" INT DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Create cvs table (read-only replica)
CREATE TABLE IF NOT EXISTS "cvs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "career_objective" TEXT,
    "is_public" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Create cv_experience table (read-only replica)
CREATE TABLE IF NOT EXISTS "cv_experience" (
    "id" SERIAL PRIMARY KEY,
    "cv_id" UUID NOT NULL REFERENCES "cvs"("id") ON DELETE CASCADE,
    "company_name" VARCHAR(255) NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "description" TEXT NOT NULL
);

-- Create cv_projects table (read-only replica)
CREATE TABLE IF NOT EXISTS "cv_projects" (
    "id" SERIAL PRIMARY KEY,
    "cv_id" UUID NOT NULL REFERENCES "cvs"("id") ON DELETE CASCADE,
    "project_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "project_url" TEXT,
    "start_date" DATE,
    "end_date" DATE
);

-- Create cv_certifications table (read-only replica)
CREATE TABLE IF NOT EXISTS "cv_certifications" (
    "id" SERIAL PRIMARY KEY,
    "cv_id" UUID NOT NULL REFERENCES "cvs"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "issued_by" VARCHAR(255),
    "issue_date" DATE,
    "credential_url" TEXT
);

-- Create job_applications table (read-only replica)
CREATE TABLE IF NOT EXISTS "job_applications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "job_id" UUID NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
    "cv_id" UUID NOT NULL REFERENCES "cvs"("id"),
    "user_id" UUID NOT NULL,
    "status" application_status NOT NULL DEFAULT 'submitted',
    "recruiter_notes" TEXT,
    "applied_at" TIMESTAMPTZ DEFAULT now(),
    UNIQUE ("job_id", "user_id")
);

-- Create saved_jobs table (read-only replica)
CREATE TABLE IF NOT EXISTS "saved_jobs" (
    "user_id" UUID NOT NULL,
    "job_id" UUID NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
    "saved_at" TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY ("user_id", "job_id")
);

-- Create indexes for better performance (same as master)
CREATE INDEX IF NOT EXISTS "idx_companies_user_id" ON "companies"("user_id");
CREATE INDEX IF NOT EXISTS "idx_companies_verification_status" ON "companies"("verification_status");
CREATE INDEX IF NOT EXISTS "idx_jobs_company_id" ON "jobs"("company_id");
CREATE INDEX IF NOT EXISTS "idx_jobs_status" ON "jobs"("status");
CREATE INDEX IF NOT EXISTS "idx_jobs_job_type" ON "jobs"("job_type");
CREATE INDEX IF NOT EXISTS "idx_jobs_is_remote" ON "jobs"("is_remote");
CREATE INDEX IF NOT EXISTS "idx_jobs_is_urgent" ON "jobs"("is_urgent");
CREATE INDEX IF NOT EXISTS "idx_cvs_user_id" ON "cvs"("user_id");
CREATE INDEX IF NOT EXISTS "idx_cvs_is_public" ON "cvs"("is_public");
CREATE INDEX IF NOT EXISTS "idx_job_applications_job_id" ON "job_applications"("job_id");
CREATE INDEX IF NOT EXISTS "idx_job_applications_user_id" ON "job_applications"("user_id");
CREATE INDEX IF NOT EXISTS "idx_job_applications_status" ON "job_applications"("status");
CREATE INDEX IF NOT EXISTS "idx_saved_jobs_user_id" ON "saved_jobs"("user_id");

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'P2A Career Module Slave database initialization completed successfully!';
    RAISE NOTICE 'Database: p2a_career (Slave)';
    RAISE NOTICE 'Tables created: companies, jobs, cvs, cv_experience, cv_projects, cv_certifications, job_applications, saved_jobs';
    RAISE NOTICE 'Enums created: company_type, verification_status, job_status, job_type, application_status';
    RAISE NOTICE 'Indexes created for better performance';
    RAISE NOTICE 'This is a read-only replica for SELECT queries';
END $$;
