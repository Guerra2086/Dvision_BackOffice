-- ============================================================
-- DVISION — Dados de exemplo (categorias, produtos, imagens,
-- variantes) para testar visualmente o frontoffice.
--
-- Como usar: correr depois de schema.sql, de uma vez, no SQL
-- Editor do Supabase. Este script é idempotente — apaga primeiro
-- os dados de exemplo anteriores (produtos com slug "dv-*" e as
-- categorias base) antes de os recriar, por isso pode ser corrido
-- várias vezes em segurança (ex: depois de atualizar imagens).
--
-- As imagens apontam para /assets/product-*.jpg, ficheiros reais
-- servidos a partir da pasta public/ do frontoffice (e backoffice).
-- Substituir por uploads no bucket product-images do Supabase
-- Storage quando houver fotografia de produto definitiva.
-- ============================================================

begin;

-- ============================================================
-- LIMPEZA (idempotência)
-- ============================================================
delete from product_variants where product_id in (select id from products where slug like 'dv-%');
delete from product_images where product_id in (select id from products where slug like 'dv-%');
delete from products where slug like 'dv-%';
delete from categories where slug in ('hoodies', 'sweats', 't-shirts', 'tshirts', 'pants', 'shorts', 'jackets', 'accessories');

-- ============================================================
-- CATEGORIAS (7, iguais ao catálogo de referência)
-- ============================================================
insert into categories (name, slug, display_order, is_active, image_url) values
  ('Hoodies', 'hoodies', 1, true, '/assets/product-hoodie.jpg'),
  ('Sweats', 'sweats', 2, true, '/assets/product-sweat.jpg'),
  ('T-Shirts', 'tshirts', 3, true, '/assets/product-tshirt.jpg'),
  ('Pants', 'pants', 4, true, '/assets/product-pants.jpg'),
  ('Shorts', 'shorts', 5, true, '/assets/product-shorts.jpg'),
  ('Jackets', 'jackets', 6, true, '/assets/product-jacket.jpg'),
  ('Accessories', 'accessories', 7, true, '/assets/product-accessory.jpg');

-- ============================================================
-- PRODUTOS
-- ============================================================
insert into products (category_id, name, slug, description, base_price, compare_at_price, sku, status, stock_quantity, is_featured) values
  ((select id from categories where slug = 'hoodies'), 'DV. Norte', 'dv-norte', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 115.00, null, 'DV-HD-001', 'active', 40, true),
  ((select id from categories where slug = 'hoodies'), 'DV. Shadow', 'dv-shadow', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 108.00, null, 'DV-HD-002', 'active', 35, true),
  ((select id from categories where slug = 'hoodies'), 'DV. Ember', 'dv-ember', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 97.00, null, 'DV-HD-003', 'active', 20, false),
  ((select id from categories where slug = 'hoodies'), 'DV. Vector', 'dv-vector', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 94.00, null, 'DV-HD-004', 'active', 30, false),
  ((select id from categories where slug = 'hoodies'), 'DV. Pulse', 'dv-pulse', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 73.00, 97.00, 'DV-HD-005', 'active', 18, true),
  ((select id from categories where slug = 'hoodies'), 'DV. Frame', 'dv-frame', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 79.00, 108.00, 'DV-HD-006', 'active', 22, false),
  ((select id from categories where slug = 'hoodies'), 'DV. Kilo', 'dv-kilo', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 84.00, 110.00, 'DV-HD-007', 'active', 16, false),

  ((select id from categories where slug = 'sweats'), 'DV. Motion', 'dv-motion', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 110.00, null, 'DV-SW-001', 'active', 28, true),
  ((select id from categories where slug = 'sweats'), 'DV. Loop', 'dv-loop', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 98.00, null, 'DV-SW-002', 'active', 32, false),
  ((select id from categories where slug = 'sweats'), 'DV. Meridian', 'dv-meridian', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 112.00, null, 'DV-SW-003', 'active', 24, true),
  ((select id from categories where slug = 'sweats'), 'DV. Baseline', 'dv-baseline', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 91.00, null, 'DV-SW-004', 'active', 26, false),
  ((select id from categories where slug = 'sweats'), 'DV. Arc', 'dv-arc', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 71.00, 94.00, 'DV-SW-005', 'active', 12, false),

  ((select id from categories where slug = 'tshirts'), 'DV. Blank', 'dv-blank', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 71.00, null, 'DV-TS-001', 'active', 50, true),
  ((select id from categories where slug = 'tshirts'), 'DV. Mark', 'dv-mark', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 31.00, 41.00, 'DV-TS-002', 'active', 45, false),
  ((select id from categories where slug = 'tshirts'), 'DV. Serif', 'dv-serif', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 46.00, null, 'DV-TS-003', 'active', 38, true),
  ((select id from categories where slug = 'tshirts'), 'DV. Kernel', 'dv-kernel', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 50.00, null, 'DV-TS-004', 'active', 33, false),
  ((select id from categories where slug = 'tshirts'), 'DV. Grid', 'dv-grid', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 39.00, null, 'DV-TS-005', 'active', 42, false),

  ((select id from categories where slug = 'pants'), 'DV. Cargo', 'dv-cargo', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 89.00, null, 'DV-PT-001', 'active', 25, true),
  ((select id from categories where slug = 'pants'), 'DV. Wide', 'dv-wide', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 82.00, null, 'DV-PT-002', 'active', 20, false),

  ((select id from categories where slug = 'shorts'), 'DV. Track', 'dv-track', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 59.00, null, 'DV-SH-001', 'active', 22, false),
  ((select id from categories where slug = 'shorts'), 'DV. Aero', 'dv-aero', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 54.00, null, 'DV-SH-002', 'active', 18, false),

  ((select id from categories where slug = 'jackets'), 'DV. Storm', 'dv-storm', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 145.00, null, 'DV-JK-001', 'active', 15, true),
  ((select id from categories where slug = 'jackets'), 'DV. Shell', 'dv-shell', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 132.00, null, 'DV-JK-002', 'active', 10, false),

  ((select id from categories where slug = 'accessories'), 'DV. Cap', 'dv-cap', 'Boné estruturado com bordado tonal, ajuste traseiro em metal.', 29.00, null, 'DV-AC-001', 'active', 30, false),
  ((select id from categories where slug = 'accessories'), 'DV. Beanie', 'dv-beanie', 'Gorro em malha canelada dupla, etiqueta tonal.', 24.00, null, 'DV-AC-002', 'active', 30, false);

-- ============================================================
-- IMAGENS (a mesma foto de categoria para todos os produtos dela)
-- ============================================================
insert into product_images (product_id, storage_path, alt_text, is_primary, display_order)
select p.id, '/assets/product-hoodie.jpg', p.name, true, 0 from products p where p.category_id = (select id from categories where slug = 'hoodies')
union all
select p.id, '/assets/product-sweat.jpg', p.name, true, 0 from products p where p.category_id = (select id from categories where slug = 'sweats')
union all
select p.id, '/assets/product-tshirt.jpg', p.name, true, 0 from products p where p.category_id = (select id from categories where slug = 'tshirts')
union all
select p.id, '/assets/product-pants.jpg', p.name, true, 0 from products p where p.category_id = (select id from categories where slug = 'pants')
union all
select p.id, '/assets/product-shorts.jpg', p.name, true, 0 from products p where p.category_id = (select id from categories where slug = 'shorts')
union all
select p.id, '/assets/product-jacket.jpg', p.name, true, 0 from products p where p.category_id = (select id from categories where slug = 'jackets')
union all
select p.id, '/assets/product-accessory.jpg', p.name, true, 0 from products p where p.category_id = (select id from categories where slug = 'accessories');

-- ============================================================
-- VARIANTES (cor x tamanho)
-- ============================================================
with product_colors (slug, color) as (
  values
    ('dv-norte', 'Ink Black'), ('dv-norte', 'Ash Grey'),
    ('dv-shadow', 'Ink Black'), ('dv-shadow', 'Bone'),
    ('dv-ember', 'Ink Black'), ('dv-ember', 'Bone'),
    ('dv-vector', 'Ink Black'), ('dv-vector', 'Signal Red'),
    ('dv-pulse', 'Ink Black'), ('dv-pulse', 'Bone'),
    ('dv-frame', 'Ink Black'), ('dv-frame', 'Ash Grey'),
    ('dv-kilo', 'Ink Black'), ('dv-kilo', 'Bone'),
    ('dv-motion', 'Bone'), ('dv-motion', 'Sand'), ('dv-motion', 'Signal Red'),
    ('dv-loop', 'Signal Red'), ('dv-loop', 'Bone'),
    ('dv-meridian', 'Ink Black'), ('dv-meridian', 'Bone'), ('dv-meridian', 'Signal Red'),
    ('dv-baseline', 'Signal Red'), ('dv-baseline', 'Bone'),
    ('dv-arc', 'Ash Grey'), ('dv-arc', 'Bone'),
    ('dv-blank', 'Ink Black'), ('dv-blank', 'Bone'), ('dv-blank', 'Signal Red'),
    ('dv-mark', 'Bone'), ('dv-mark', 'Ash Grey'),
    ('dv-serif', 'Bone'), ('dv-serif', 'Ash Grey'),
    ('dv-kernel', 'Bone'), ('dv-kernel', 'Ink Black'),
    ('dv-grid', 'Bone'), ('dv-grid', 'Ink Black'), ('dv-grid', 'Signal Red'),
    ('dv-cargo', 'Sand'), ('dv-cargo', 'Ink Black'),
    ('dv-wide', 'Ink Black'), ('dv-wide', 'Ash Grey'),
    ('dv-track', 'Ink Black'), ('dv-track', 'Signal Red'),
    ('dv-aero', 'Bone'), ('dv-aero', 'Ink Black'),
    ('dv-storm', 'Ink Black'), ('dv-storm', 'Ash Grey'),
    ('dv-shell', 'Ink Black'), ('dv-shell', 'Sand')
),
sizes (size) as (
  values ('S'), ('M'), ('L'), ('XL')
)
insert into product_variants (product_id, size, color, sku, stock_quantity)
select p.id,
       s.size,
       pc.color,
       upper(p.slug) || '-' || upper(replace(pc.color, ' ', '')) || '-' || s.size,
       15
from product_colors pc
join products p on p.slug = pc.slug
cross join sizes s;

-- Acessórios: tamanho único
with accessory_colors (slug, color) as (
  values
    ('dv-cap', 'Ink Black'), ('dv-cap', 'Bone'),
    ('dv-beanie', 'Ink Black'), ('dv-beanie', 'Signal Red')
)
insert into product_variants (product_id, size, color, sku, stock_quantity)
select p.id, 'ONE', ac.color, upper(p.slug) || '-' || upper(replace(ac.color, ' ', '')) || '-ONE', 20
from accessory_colors ac
join products p on p.slug = ac.slug;

commit;
