-- Practices
create table practices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  slug text unique not null,
  name text,
  practice_type text check (practice_type in ('dental', 'medical', 'legal', 'financial', 'other')),
  address jsonb,
  phone text,
  website text,
  accepted_insurance text[],
  is_active boolean default true,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'starter' check (plan in ('starter', 'professional', 'enterprise')),
  timezone text default 'America/New_York',
  created_at timestamptz default now()
);

create index idx_practices_user_id on practices(user_id);
create index idx_practices_slug on practices(slug);

-- Services
create table services (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid references practices on delete cascade not null,
  name text not null,
  price_min integer,
  price_max integer,
  duration_minutes integer,
  description text
);

create index idx_services_practice_id on services(practice_id);

-- Availability
create table availability (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid references practices on delete cascade not null,
  day_of_week integer not null check (day_of_week >= 0 and day_of_week <= 6),
  open_time time not null,
  close_time time not null,
  is_open boolean default true
);

create index idx_availability_practice_id on availability(practice_id);

-- Providers
create table providers (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid references practices on delete cascade not null,
  name text not null,
  title text,
  specialties text[],
  bio text,
  accepting_new_patients boolean default true
);

create index idx_providers_practice_id on providers(practice_id);

-- Appointments
create table appointments (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid references practices on delete cascade not null,
  confirmation_number text unique not null,
  patient_name text not null,
  patient_email text,
  patient_phone text,
  service text not null,
  appointment_date date not null,
  appointment_time time not null,
  notes text,
  booked_by text default 'ai_agent' check (booked_by in ('ai_agent', 'human')),
  created_at timestamptz default now()
);

create index idx_appointments_practice_id on appointments(practice_id);
create index idx_appointments_date on appointments(appointment_date);

-- AI Query Log
create table ai_queries (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid references practices on delete cascade not null,
  tool_called text not null,
  agent_identifier text,
  query_payload jsonb,
  response_payload jsonb,
  created_at timestamptz default now()
);

create index idx_ai_queries_practice_id on ai_queries(practice_id);
create index idx_ai_queries_created_at on ai_queries(created_at);
