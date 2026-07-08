-- ============================================================
-- DVISION — Dados de exemplo (categorias, produtos, imagens,
-- variantes) para testar visualmente o frontoffice.
--
-- Como usar: correr depois de schema.sql, de uma vez, no SQL
-- Editor do Supabase. Pode ser corrido várias vezes em segurança
-- (usa ON CONFLICT DO NOTHING nas tabelas com slug/sku únicos).
--
-- As imagens usam o serviço público loremflickr.com (fotos reais
-- por palavra-chave, gratuito, sem necessidade de upload) só para
-- efeitos de demonstração visual. Substituir por uploads reais no
-- bucket product-images do Supabase Storage quando houver fotografia
-- de produto definitiva.
-- ============================================================

begin;

-- ============================================================
-- CATEGORIAS
-- ============================================================
insert into categories (name, slug, display_order, is_active, image_url) values
  ('Hoodies', 'hoodies', 1, true, 'https://loremflickr.com/800/800/hoodie,streetwear?lock=101'),
  ('Sweats', 'sweats', 2, true, 'https://loremflickr.com/800/800/sweatshirt,fashion?lock=102'),
  ('T-Shirts', 't-shirts', 3, true, 'https://loremflickr.com/800/800/tshirt,fashion?lock=103'),
  ('Pants', 'pants', 4, true, 'https://loremflickr.com/800/800/pants,fashion?lock=104'),
  ('Jackets', 'jackets', 5, true, 'https://loremflickr.com/800/800/jacket,fashion?lock=105')
on conflict (slug) do nothing;

-- ============================================================
-- PRODUTOS
-- ============================================================
insert into products (category_id, name, slug, description, base_price, compare_at_price, sku, status, stock_quantity, is_featured) values
  ((select id from categories where slug = 'hoodies'), 'DV. Norte', 'dv-norte', 'Hoodie premium em felpo pesado, corte regular-baggy.', 115.00, null, 'DV-HD-001', 'active', 40, true),
  ((select id from categories where slug = 'hoodies'), 'DV. Shadow', 'dv-shadow', 'Hoodie essencial em preto profundo, capuz forrado.', 108.00, null, 'DV-HD-002', 'active', 35, true),
  ((select id from categories where slug = 'hoodies'), 'DV. Ember', 'dv-ember', 'Hoodie edição limitada, bordado subtil no peito.', 97.00, null, 'DV-HD-003', 'active', 20, false),
  ((select id from categories where slug = 'hoodies'), 'DV. Vector', 'dv-vector', 'Hoodie streetwear com bolso canguru reforçado.', 94.00, null, 'DV-HD-004', 'active', 30, false),
  ((select id from categories where slug = 'hoodies'), 'DV. Pulse', 'dv-pulse', 'Hoodie da coleção signal red, tecido escovado.', 73.00, 97.00, 'DV-HD-005', 'active', 18, false),
  ((select id from categories where slug = 'hoodies'), 'DV. Frame', 'dv-frame', 'Hoodie corte solto, punhos e cós em ribana.', 79.00, 108.00, 'DV-HD-006', 'active', 22, false),
  ((select id from categories where slug = 'hoodies'), 'DV. Kilo', 'dv-kilo', 'Hoodie heavyweight 450gsm, silhueta oversized.', 84.00, 110.00, 'DV-HD-007', 'active', 16, false),

  ((select id from categories where slug = 'sweats'), 'DV. Motion', 'dv-motion', 'Sweatshirt em french terry, gola careca clássica.', 110.00, null, 'DV-SW-001', 'active', 28, true),
  ((select id from categories where slug = 'sweats'), 'DV. Loop', 'dv-loop', 'Sweatshirt básica premium, algodão penteado.', 98.00, null, 'DV-SW-002', 'active', 32, false),
  ((select id from categories where slug = 'sweats'), 'DV. Meridian', 'dv-meridian', 'Sweatshirt com costuras duplas e etiqueta tonal.', 112.00, null, 'DV-SW-003', 'active', 24, false),
  ((select id from categories where slug = 'sweats'), 'DV. Baseline', 'dv-baseline', 'Sweatshirt corte reto, tecido 320gsm.', 91.00, null, 'DV-SW-004', 'active', 26, false),
  ((select id from categories where slug = 'sweats'), 'DV. Arc', 'dv-arc', 'Sweatshirt da coleção limitada, últimas unidades.', 71.00, 94.00, 'DV-SW-005', 'active', 12, false),

  ((select id from categories where slug = 't-shirts'), 'DV. Blank', 'dv-blank', 'Peça de silhueta regular com inspiração baggy. Construção premium desenhada em Portugal, com atenção obsessiva ao caimento, pespontos duplos e etiquetas tonais. Feita para durar coleção após coleção.', 71.00, null, 'DV-TS-001', 'active', 50, true),
  ((select id from categories where slug = 't-shirts'), 'DV. Mark', 'dv-mark', 'T-shirt essencial em algodão orgânico 220gsm.', 31.00, 41.00, 'DV-TS-002', 'active', 45, false),
  ((select id from categories where slug = 't-shirts'), 'DV. Serif', 'dv-serif', 'T-shirt com print tipográfico subtil nas costas.', 46.00, null, 'DV-TS-003', 'active', 38, false),
  ((select id from categories where slug = 't-shirts'), 'DV. Kernel', 'dv-kernel', 'T-shirt corte boxy, gola reforçada.', 50.00, null, 'DV-TS-004', 'active', 33, false),
  ((select id from categories where slug = 't-shirts'), 'DV. Grid', 'dv-grid', 'T-shirt básica em pack, três cores disponíveis.', 39.00, null, 'DV-TS-005', 'active', 42, false),

  ((select id from categories where slug = 'pants'), 'DV. Cargo', 'dv-cargo', 'Calças cargo com bolsos laterais utilitários.', 89.00, null, 'DV-PT-001', 'active', 25, true),
  ((select id from categories where slug = 'pants'), 'DV. Wide', 'dv-wide', 'Calças wide-leg em tecido técnico leve.', 82.00, null, 'DV-PT-002', 'active', 20, false),

  ((select id from categories where slug = 'jackets'), 'DV. Storm', 'dv-storm', 'Corta-vento técnico com forro interior e capuz ajustável.', 145.00, null, 'DV-JK-001', 'active', 15, true)
on conflict (slug) do nothing;

-- ============================================================
-- IMAGENS (1 imagem principal por produto, via loremflickr)
-- ============================================================
with product_images_seed (slug, keyword, lock) as (
  values
    ('dv-norte', 'hoodie,streetwear', 1),
    ('dv-shadow', 'hoodie,streetwear', 2),
    ('dv-ember', 'hoodie,streetwear', 3),
    ('dv-vector', 'hoodie,streetwear', 4),
    ('dv-pulse', 'hoodie,streetwear', 5),
    ('dv-frame', 'hoodie,streetwear', 6),
    ('dv-kilo', 'hoodie,streetwear', 7),
    ('dv-motion', 'sweatshirt,fashion', 11),
    ('dv-loop', 'sweatshirt,fashion', 12),
    ('dv-meridian', 'sweatshirt,fashion', 13),
    ('dv-baseline', 'sweatshirt,fashion', 14),
    ('dv-arc', 'sweatshirt,fashion', 15),
    ('dv-blank', 'tshirt,fashion', 21),
    ('dv-mark', 'tshirt,fashion', 22),
    ('dv-serif', 'tshirt,fashion', 23),
    ('dv-kernel', 'tshirt,fashion', 24),
    ('dv-grid', 'tshirt,fashion', 25),
    ('dv-cargo', 'pants,fashion', 31),
    ('dv-wide', 'pants,fashion', 32),
    ('dv-storm', 'jacket,fashion', 41)
)
insert into product_images (product_id, storage_path, alt_text, is_primary, display_order)
select p.id,
       'https://loremflickr.com/800/1000/' || pis.keyword || '?lock=' || pis.lock,
       p.name,
       true,
       0
from product_images_seed pis
join products p on p.slug = pis.slug
where not exists (
  select 1 from product_images pi where pi.product_id = p.id
);

-- ============================================================
-- VARIANTES (cor x tamanho)
-- ============================================================
with product_colors (slug, color) as (
  values
    ('dv-norte', 'Black'), ('dv-norte', 'Ash Grey'),
    ('dv-shadow', 'Black'), ('dv-shadow', 'White'),
    ('dv-ember', 'Black'), ('dv-ember', 'White'),
    ('dv-vector', 'Black'), ('dv-vector', 'Red'),
    ('dv-pulse', 'Black'), ('dv-pulse', 'White'),
    ('dv-frame', 'Black'), ('dv-frame', 'Grey'),
    ('dv-kilo', 'Black'), ('dv-kilo', 'White'),
    ('dv-motion', 'White'), ('dv-motion', 'Beige'), ('dv-motion', 'Red'),
    ('dv-loop', 'Red'), ('dv-loop', 'White'),
    ('dv-meridian', 'Black'), ('dv-meridian', 'White'), ('dv-meridian', 'Red'),
    ('dv-baseline', 'Red'), ('dv-baseline', 'White'),
    ('dv-arc', 'Grey'), ('dv-arc', 'White'),
    ('dv-blank', 'Ink Black'), ('dv-blank', 'White'), ('dv-blank', 'Red'),
    ('dv-mark', 'White'), ('dv-mark', 'Grey'),
    ('dv-serif', 'White'), ('dv-serif', 'Grey'),
    ('dv-kernel', 'White'), ('dv-kernel', 'Black'),
    ('dv-grid', 'White'), ('dv-grid', 'Black'), ('dv-grid', 'Red'),
    ('dv-cargo', 'Beige'), ('dv-cargo', 'Black'),
    ('dv-wide', 'Black'), ('dv-wide', 'Grey'),
    ('dv-storm', 'Black'), ('dv-storm', 'Grey')
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
cross join sizes s
where not exists (
  select 1 from product_variants pv
  where pv.product_id = p.id and pv.size = s.size and pv.color = pc.color
);

commit;
