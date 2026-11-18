-- Papéis (roles) ficam numa tabela separada
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Cada um vê os próprios papéis" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- E-mails que podem ser administradores (sem acesso pelo site)
create table public.admin_emails (
  email text primary key check (email = lower(trim(email)))
);
grant all on public.admin_emails to service_role;
alter table public.admin_emails enable row level security;

-- Quando a conta tem e-mail confirmado e está na lista, vira admin
create or replace function public.dar_admin_se_permitido()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null
     and exists (select 1 from public.admin_emails where email = lower(new.email)) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

create trigger dar_admin_ao_criar
  after insert on auth.users
  for each row execute function public.dar_admin_se_permitido();

create trigger dar_admin_ao_confirmar
  after update of email_confirmed_at on auth.users
  for each row execute function public.dar_admin_se_permitido();

-- Quando um e-mail entra na lista e a conta já existe (confirmada), vira admin também
create or replace function public.dar_admin_para_email_novo()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.user_roles (user_id, role)
  select u.id, 'admin' from auth.users u
  where lower(u.email) = new.email and u.email_confirmed_at is not null
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;

create trigger dar_admin_email_novo
  after insert on public.admin_emails
  for each row execute function public.dar_admin_para_email_novo();

revoke execute on function public.dar_admin_se_permitido() from public, anon, authenticated;
revoke execute on function public.dar_admin_para_email_novo() from public, anon, authenticated;

-- Produtos da vitrine
create table public.produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (length(trim(nome)) > 0),
  preco numeric(10,2) not null check (preco > 0),
  categoria text not null default 'Bolsa' check (categoria in ('Bolsa', 'Acessório')),
  imagem text not null,
  created_at timestamptz not null default now()
);
grant select on public.produtos to anon, authenticated;
grant insert, update, delete on public.produtos to authenticated;
grant all on public.produtos to service_role;
alter table public.produtos enable row level security;

create policy "Todo mundo vê as peças" on public.produtos
  for select to anon, authenticated using (true);
create policy "Só admin cadastra" on public.produtos
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Só admin edita" on public.produtos
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Só admin apaga" on public.produtos
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

insert into public.produtos (nome, preco, categoria, imagem, created_at) values
  ('Bolsa Saco Oliva', 165, 'Bolsa', '/__l5e/assets-v1/32089896-137a-44c6-8bc0-b0a2c924857d/bolsa-saco-oliva.jpg', '2026-11-17 18:00:01+00'),
  ('Bolsa Noite na Mata', 165, 'Bolsa', '/__l5e/assets-v1/b4e3e431-fcaa-44a8-9d24-acd5f6bdd3b2/bolsa-noite-na-mata.jpg', '2026-11-17 18:00:02+00'),
  ('Bolsa Rosa Doce', 150, 'Bolsa', '/__l5e/assets-v1/5a9a77b6-bd8b-4885-a47f-f16b96f64627/bolsa-rosa-doce.jpg', '2026-11-17 18:00:03+00'),
  ('Bolsa Sálvia', 165, 'Bolsa', '/__l5e/assets-v1/9c413a9e-7038-4189-8e22-e8813a188b58/bolsa-salvia.jpg', '2026-11-17 18:00:04+00'),
  ('Bolsa Esmeralda Dourada', 150, 'Bolsa', '/__l5e/assets-v1/3f4ce4bb-9184-4db5-9166-6efe2ffa86c6/bolsa-esmeralda-dourada.jpg', '2026-11-17 18:00:05+00'),
  ('Bolsa Elegância', 170, 'Bolsa', '/__l5e/assets-v1/07559452-6af0-481c-a3f2-d6437dc1b476/bolsa-elegancia.jpg', '2026-11-17 18:00:06+00'),
  ('Bolsa Gala Dourada', 300, 'Bolsa', '/__l5e/assets-v1/05cb2546-c89c-4cda-bd65-b36ebf4b8886/bolsa-gala-dourada.jpg', '2026-11-17 18:00:07+00'),
  ('Bolsa Girassol', 165, 'Bolsa', '/__l5e/assets-v1/466d0fe0-ffa6-4a32-a64f-9b60baf6af96/bolsa-girassol.jpg', '2026-11-17 18:00:08+00'),
  ('Bolsa Flor de Lótus', 180, 'Bolsa', '/__l5e/assets-v1/a7ed6733-4e03-4469-abbd-f56b1df1dcd8/bolsa-flor-de-lotus.jpg', '2026-11-17 18:00:09+00'),
  ('Bolsa Pérola', 130, 'Bolsa', '/__l5e/assets-v1/461f2855-0266-4872-b420-8013fe655163/bolsa-perola.jpg', '2026-11-17 18:00:10+00');