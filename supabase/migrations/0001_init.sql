-- Dogs Help — initial schema
-- Run in the Supabase SQL editor, or with: supabase db push

create extension if not exists "pgcrypto";

create table if not exists public.dogs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  breed text not null,
  age_years numeric not null default 1,
  story text not null,
  goal_usd numeric not null default 500,
  raised_usd numeric not null default 0,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  amount_usd numeric not null,
  donor_email text,
  dog_id uuid references public.dogs (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Called by the Stripe webhook to keep the progress bars in sync.
create or replace function public.increment_raised (p_dog_id uuid, p_amount numeric)
returns void
language sql
security definer
as $$
  update public.dogs
  set raised_usd = raised_usd + p_amount
  where id = p_dog_id;
$$;

-- Row Level Security: dogs are public to read; donations are private
-- (the app writes them with the service-role key, which bypasses RLS).
alter table public.dogs enable row level security;
alter table public.donations enable row level security;

create policy "Dogs are viewable by everyone"
  on public.dogs for select
  using (true);

-- Seed a few dogs so the site has real data right away.
insert into public.dogs (name, breed, age_years, story, goal_usd, raised_usd, image_url)
values
  ('Biscuit', 'Golden Retriever mix', 3,
   'Found wandering a highway rest stop, Biscuit needs surgery on his back leg before he can run again.',
   2400, 1650, 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80'),
  ('Luna', 'Husky', 5,
   'Surrendered when her family moved, Luna is heartworm-positive and partway through treatment.',
   1200, 480, 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&q=80'),
  ('Pepper', 'Border Collie', 1,
   'A puppy-mill rescue learning that people can be kind. Pepper needs vaccinations and a behaviorist.',
   900, 720, 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=800&q=80')
on conflict do nothing;
