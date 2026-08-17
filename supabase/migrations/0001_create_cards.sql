create table if not exists public.cards (
  id bigint generated always as identity primary key,
  id_no text not null,
  name text not null,
  designation text,
  office_dept text,
  photo_path text,
  signature_path text,
  home_address text,
  dob text,
  blood_group text,
  mobile text,
  email text,
  identification_mark text,
  date_of_issue text,
  valid_upto text,
  pdf_path text,
  created_at text not null,
  updated_at text not null
);

-- Row Level Security with no policies = deny-by-default for the anon/authenticated
-- roles. The app only ever talks to this table server-side using the service_role
-- key, which bypasses RLS by design, so no policies are needed here.
alter table public.cards enable row level security;
