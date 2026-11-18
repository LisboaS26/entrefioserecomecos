ALTER TABLE public.produtos
  ADD COLUMN IF NOT EXISTS material text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS medidas text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cores text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS prazo text NOT NULL DEFAULT '';

GRANT SELECT, INSERT, UPDATE, DELETE ON public.produtos TO authenticated;
GRANT ALL ON public.produtos TO service_role;