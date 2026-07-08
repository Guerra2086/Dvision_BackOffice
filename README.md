# DVISION — Backoffice

Área administrativa da DVISION (apenas admins). React + Vite + TypeScript + Tailwind CSS, ligada ao mesmo projeto Supabase que o [dvision-frontoffice](https://github.com/Guerra2086/Dvision_FrontOffice), com permissões diferenciadas via RLS + verificação de role admin.

## Funcionalidades

- Dashboard com métricas
- Gestão de produtos, categorias e imagens (upload para Supabase Storage)
- Gestão de stock e variantes
- Gestão de encomendas
- Gestão de clientes
- Gestão da homepage (secções configuráveis)
- Moderação de reviews

## Instalação

```bash
npm install
cp .env.example .env.local   # preencher com as credenciais do Supabase
npm run dev
```

## Ligação ao Supabase

1. No [dashboard do Supabase](https://supabase.com/dashboard), abre o projeto DVISION (o mesmo usado pelo frontoffice).
2. Em **Project Settings -> API**, copia o `Project URL` e a `anon public key`.
3. Cola-os em `.env.local`:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

4. O schema completo (tabelas, RLS, storage) está em `supabase/schema.sql` — só precisa de ser corrido uma vez no SQL Editor (o mesmo script serve para os dois repositórios, já que partilham base de dados).
5. O acesso ao backoffice requer que o utilizador tenha `profiles.role = 'admin'` **e** um registo ativo em `admin_users`. Depois de criares a tua conta via signup normal, promove-te a admin correndo no SQL Editor:

```sql
update profiles set role = 'admin' where id = '<o-teu-uuid>';
insert into admin_users (id, profile_id, admin_role)
  values ('<o-teu-uuid>', '<o-teu-uuid>', 'super_admin');
```

(o uuid está em **Authentication -> Users** no dashboard Supabase)

6. Sempre que o schema mudar, regenerar os tipos TypeScript locais:

```bash
npm run gen:types
```

## Deploy (Vercel)

1. Importar este repositório num novo projeto Vercel (separado do frontoffice).
2. Framework preset: **Vite**. Build command: `npm run build`. Output: `dist`.
3. Adicionar as env vars `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (Production, Preview e Development).
4. Configurar um subdomínio (ex: `admin.dvision.pt`) em **Settings -> Domains**.

O `vercel.json` incluído já trata do rewrite necessário para o client-side routing (React Router).

**Nota de segurança:** a validação de admin no frontend é apenas UX — a segurança real está garantida pelas RLS policies no Postgres (função `is_admin()`), que bloqueiam qualquer escrita/leitura não autorizada mesmo que alguém contorne a UI.
