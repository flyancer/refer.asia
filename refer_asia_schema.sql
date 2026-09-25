-- ═══════════════════════════════════════════════════════
-- REFER.ASIA — Initial Database Schema
-- Paste this whole file into a NEW Supabase project's SQL Editor → Run
-- (Do not reuse the Flyancer project — this is a separate product)
-- ═══════════════════════════════════════════════════════

-- ── PROFILES ──
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  role text not null check (role in ('candidate', 'expert')),
  full_name text not null,
  company text,
  job_title text,
  bio text,
  is_verified boolean default false,
  verified_domain text,
  verified_at timestamptz,

  -- ₹99/year membership (candidate side)
  is_member boolean default false,
  membership_started_at timestamptz,
  membership_expires_at timestamptz,

  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);


-- ── COMPANIES ──
create table companies (
  domain text primary key,
  name text not null,
  logo_url text
);

alter table companies enable row level security;

create policy "Companies are viewable by everyone"
  on companies for select using (true);

insert into companies (domain, name) values
  ('google.com', 'Google'),
  ('amazon.com', 'Amazon'),
  ('microsoft.com', 'Microsoft'),
  ('flipkart.com', 'Flipkart'),
  ('swiggy.com', 'Swiggy');


-- ── SERVICES ──
-- (referral requests, mock interviews, etc. — same pattern as Flyancer)
create table services (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  price_inr integer not null check (price_inr > 0),
  service_type text not null check (
    service_type in ('referral', 'mock_interview', 'coaching', 'resume_review')
  ),
  created_at timestamptz default now()
);

alter table services enable row level security;

create policy "Services are viewable by everyone"
  on services for select using (true);

create policy "Experts can manage their own services"
  on services for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);


-- ── JOB POSTINGS ──
-- Submitted by verified HR/Interviewers/Employers, reviewed before going live,
-- ₹9 payout tracked once approved.
create table job_postings (
  id uuid primary key default gen_random_uuid(),
  posted_by uuid not null references profiles(id),

  company text not null,
  title text not null,
  employment_type text check (
    employment_type in ('full_time', 'internship', 'contract', 'remote')
  ),
  location text,
  jd_text text not null,

  status text not null default 'pending_review' check (
    status in ('pending_review', 'approved', 'rejected')
  ),
  reviewed_at timestamptz,

  payout_amount integer default 9,
  payout_status text not null default 'pending' check (
    payout_status in ('pending', 'paid')
  ),

  created_at timestamptz default now()
);

alter table job_postings enable row level security;

-- Only approved postings are publicly visible
create policy "Approved job postings are viewable by everyone"
  on job_postings for select
  using (status = 'approved');

-- The poster can also see their own postings, whatever the status
create policy "Posters can view their own submissions"
  on job_postings for select
  using (auth.uid() = posted_by);

-- Only verified experts can submit a posting
create policy "Verified experts can submit job postings"
  on job_postings for insert
  with check (
    auth.uid() = posted_by
    and exists (
      select 1 from profiles
      where id = auth.uid() and role = 'expert' and is_verified = true
    )
  );

-- NOTE: approving/rejecting postings (status, reviewed_at, payout_status)
-- is done manually by you in the Supabase Table Editor for now —
-- no public update policy is created, so only you (via the dashboard,
-- which uses elevated access) can change those fields. This is intentional.


-- ── BOOKINGS ──
create table bookings (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references profiles(id),
  expert_id uuid not null references profiles(id),
  service_id uuid not null references services(id),
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'declined', 'completed')
  ),
  resume_url text,
  job_url text,
  message text,
  created_at timestamptz default now()
);

alter table bookings enable row level security;

create policy "Involved users can view their bookings"
  on bookings for select
  using (auth.uid() = candidate_id or auth.uid() = expert_id);

create policy "Candidates can create bookings"
  on bookings for insert
  with check (auth.uid() = candidate_id);

create policy "Involved users can update their bookings"
  on bookings for update
  using (auth.uid() = candidate_id or auth.uid() = expert_id);
