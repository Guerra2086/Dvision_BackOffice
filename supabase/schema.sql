-- ============================================================
-- DVISION — Schema completo (tabelas, RLS, triggers, storage)
--
-- Como usar: copiar todo este ficheiro e correr de uma vez no
-- SQL Editor do projeto Supabase (https://supabase.com/dashboard
-- -> o teu projeto -> SQL Editor -> New query -> colar -> Run).
--
-- Este ficheiro está duplicado em frontoffice/supabase/schema.sql
-- (repos independentes, mesmo projeto Supabase) apenas para
-- rastreabilidade em ambos os repositórios.
-- ============================================================

begin;

-- ============================================================
-- EXTENSÕES
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
create type product_status as enum ('draft', 'active', 'archived');
create type order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type admin_role as enum ('super_admin', 'manager', 'editor');
create type homepage_section_type as enum ('hero', 'marquee', 'featured_products', 'category_grid', 'banner', 'testimonials', 'trust_badges', 'newsletter_cta', 'custom_html');

-- ============================================================
-- FUNÇÃO: updated_at automático
-- ============================================================
create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- TABELAS
-- ============================================================

-- profiles (1:1 com auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on profiles
  for each row execute function handle_updated_at();

-- admin_users
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  admin_role admin_role not null default 'manager',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- categories (self-referencing)
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references categories(id) on delete set null,
  image_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on categories
  for each row execute function handle_updated_at();

-- products
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  base_price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  sku text unique,
  status product_status not null default 'draft',
  stock_quantity integer not null default 0,
  is_featured boolean not null default false,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on products
  for each row execute function handle_updated_at();

-- product_images
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  display_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

-- product_variants
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text,
  color text,
  sku text unique,
  price_override numeric(10,2),
  stock_quantity integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size, color)
);

create trigger set_updated_at before update on product_variants
  for each row execute function handle_updated_at();

-- customers
create table customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  billing_address jsonb,
  shipping_address jsonb,
  accepts_marketing boolean not null default false,
  total_orders integer not null default 0,
  total_spent numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on customers
  for each row execute function handle_updated_at();

-- orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete restrict,
  order_number text unique,
  status order_status not null default 'pending',
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) not null default 0,
  discount_total numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  shipping_address jsonb not null,
  billing_address jsonb not null,
  payment_method text,
  payment_status text not null default 'unpaid',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on orders
  for each row execute function handle_updated_at();

-- geração automática de order_number (ex: DV-2026-000123)
create sequence if not exists order_number_seq start 1;

create or replace function generate_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null then
    new.order_number := 'DV-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('order_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create trigger set_order_number before insert on orders
  for each row execute function generate_order_number();

-- order_items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name_snapshot text not null,
  unit_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- cart_items
create table cart_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete cascade,
  quantity integer not null check (quantity > 0) default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, product_id, variant_id)
);

create trigger set_updated_at before update on cart_items
  for each row execute function handle_updated_at();

-- wishlist
create table wishlist (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (profile_id, product_id)
);

-- newsletter_subscribers
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  profile_id uuid references profiles(id) on delete set null,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- homepage_sections
create table homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_type homepage_section_type not null,
  title text,
  subtitle text,
  content jsonb not null default '{}',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on homepage_sections
  for each row execute function handle_updated_at();

-- product_reviews
create table product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  order_item_id uuid references order_items(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  comment text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, profile_id)
);

create trigger set_updated_at before update on product_reviews
  for each row execute function handle_updated_at();

-- ============================================================
-- TRIGGER: criar profile automaticamente no signup
-- ============================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- FUNÇÃO: is_admin() — usada em todas as policies de escrita
-- ============================================================
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from admin_users au
    join profiles p on p.id = au.profile_id
    where au.id = auth.uid() and au.is_active = true and p.role = 'admin'
  );
$$;

-- ============================================================
-- RLS — ativar em todas as tabelas
-- ============================================================
alter table profiles enable row level security;
alter table admin_users enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table cart_items enable row level security;
alter table wishlist enable row level security;
alter table newsletter_subscribers enable row level security;
alter table homepage_sections enable row level security;
alter table product_reviews enable row level security;

-- profiles
create policy "profiles_select_own_or_admin" on profiles
  for select using (id = auth.uid() or is_admin());
create policy "profiles_update_own" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid() and role = 'customer');
create policy "profiles_update_admin" on profiles
  for update using (is_admin());

-- admin_users
create policy "admin_users_select_admin" on admin_users for select using (is_admin());
create policy "admin_users_all_admin" on admin_users for all using (is_admin()) with check (is_admin());

-- categories
create policy "categories_public_read" on categories for select using (is_active = true or is_admin());
create policy "categories_admin_insert" on categories for insert with check (is_admin());
create policy "categories_admin_update" on categories for update using (is_admin());
create policy "categories_admin_delete" on categories for delete using (is_admin());

-- products
create policy "products_public_read_active" on products for select using (status = 'active' or is_admin());
create policy "products_admin_insert" on products for insert with check (is_admin());
create policy "products_admin_update" on products for update using (is_admin());
create policy "products_admin_delete" on products for delete using (is_admin());

-- product_images
create policy "product_images_public_read" on product_images for select using (
  is_admin() or exists (select 1 from products p where p.id = product_id and p.status = 'active')
);
create policy "product_images_admin_write" on product_images for all using (is_admin()) with check (is_admin());

-- product_variants
create policy "product_variants_public_read" on product_variants for select using (
  is_admin() or exists (select 1 from products p where p.id = product_id and p.status = 'active')
);
create policy "product_variants_admin_write" on product_variants for all using (is_admin()) with check (is_admin());

-- customers
create policy "customers_select_own_or_admin" on customers for select using (profile_id = auth.uid() or is_admin());
create policy "customers_update_own_or_admin" on customers for update using (profile_id = auth.uid() or is_admin());
create policy "customers_insert_own" on customers for insert with check (profile_id = auth.uid());
create policy "customers_admin_delete" on customers for delete using (is_admin());

-- orders
create policy "orders_select_own_or_admin" on orders for select using (
  is_admin() or exists (select 1 from customers c where c.id = customer_id and c.profile_id = auth.uid())
);
create policy "orders_insert_own" on orders for insert with check (
  exists (select 1 from customers c where c.id = customer_id and c.profile_id = auth.uid())
);
create policy "orders_admin_update" on orders for update using (is_admin());

-- order_items
create policy "order_items_select_own_or_admin" on order_items for select using (
  is_admin() or exists (
    select 1 from orders o join customers c on c.id = o.customer_id
    where o.id = order_id and c.profile_id = auth.uid()
  )
);
create policy "order_items_insert_own" on order_items for insert with check (
  exists (
    select 1 from orders o join customers c on c.id = o.customer_id
    where o.id = order_id and c.profile_id = auth.uid()
  )
);
create policy "order_items_admin_update" on order_items for update using (is_admin());
create policy "order_items_admin_delete" on order_items for delete using (is_admin());

-- cart_items
create policy "cart_items_own_all" on cart_items for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "cart_items_admin_read" on cart_items for select using (is_admin());

-- wishlist
create policy "wishlist_own_all" on wishlist for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "wishlist_admin_read" on wishlist for select using (is_admin());

-- newsletter_subscribers
create policy "newsletter_insert_anyone" on newsletter_subscribers for insert with check (true);
create policy "newsletter_select_own_or_admin" on newsletter_subscribers for select using (profile_id = auth.uid() or is_admin());
create policy "newsletter_update_own_or_admin" on newsletter_subscribers for update using (profile_id = auth.uid() or is_admin());
create policy "newsletter_admin_delete" on newsletter_subscribers for delete using (is_admin());

-- homepage_sections
create policy "homepage_public_read" on homepage_sections for select using (is_active = true or is_admin());
create policy "homepage_admin_write" on homepage_sections for all using (is_admin()) with check (is_admin());

-- product_reviews
create policy "reviews_public_read_approved" on product_reviews for select using (is_approved = true or profile_id = auth.uid() or is_admin());
create policy "reviews_insert_own" on product_reviews for insert with check (profile_id = auth.uid());
create policy "reviews_update_own_or_admin" on product_reviews for update using (profile_id = auth.uid() or is_admin());
create policy "reviews_delete_own_or_admin" on product_reviews for delete using (profile_id = auth.uid() or is_admin());

-- ============================================================
-- STORAGE — buckets + policies
-- ============================================================
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('homepage-assets', 'homepage-assets', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

create policy "product_images_bucket_public_read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "product_images_bucket_admin_write" on storage.objects
  for insert with check (bucket_id = 'product-images' and is_admin());
create policy "product_images_bucket_admin_update" on storage.objects
  for update using (bucket_id = 'product-images' and is_admin());
create policy "product_images_bucket_admin_delete" on storage.objects
  for delete using (bucket_id = 'product-images' and is_admin());

create policy "homepage_assets_bucket_public_read" on storage.objects
  for select using (bucket_id = 'homepage-assets');
create policy "homepage_assets_bucket_admin_write" on storage.objects
  for insert with check (bucket_id = 'homepage-assets' and is_admin());
create policy "homepage_assets_bucket_admin_update" on storage.objects
  for update using (bucket_id = 'homepage-assets' and is_admin());
create policy "homepage_assets_bucket_admin_delete" on storage.objects
  for delete using (bucket_id = 'homepage-assets' and is_admin());

create policy "avatars_bucket_public_read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatars_bucket_own_write" on storage.objects
  for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_bucket_own_update" on storage.objects
  for update using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_bucket_own_delete" on storage.objects
  for delete using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

commit;

-- ============================================================
-- PRÓXIMO PASSO (manual, depois de correr este script):
-- Promover o primeiro admin, depois de criares a tua conta
-- normal via signup na app:
--
--   update profiles set role = 'admin' where id = '<uuid-do-teu-user>';
--   insert into admin_users (id, profile_id, admin_role)
--     values ('<uuid-do-teu-user>', '<uuid-do-teu-user>', 'super_admin');
--
-- O uuid encontra-se em Authentication -> Users no dashboard Supabase.
-- ============================================================
