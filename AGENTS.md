<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Store rules (price validation, product lookup, price formatting) live as pure functions in `src/lib/produtos.ts` with tests in `src/test/`; why: they mirror the original Python assignment and must stay checkable.
- Products live in the Cloud `produtos` table: public reads go through the `listarProdutos` server fn (root loader + `produtosQuery`), writes use the browser client and RLS allows only `admin` role; why: every visitor sees the same catalog and only the shop can change it.
- Shop admins are granted by DB triggers from the `admin_emails` allowlist once the email is confirmed; `/cadastrar` lives under `_authenticated` and also checks the role; why: no one can self-promote from the browser.
- Uploaded product photos are stored as resized JPEG data URLs in `produtos.imagem`; why: the workspace blocks public storage buckets.
- Store contacts (WhatsApp, Instagram) are defined only in `src/lib/contato.ts`; why: one place to change them.
- Product descriptions persist in `produtos.descricao`; editing reuses the protected product form and browser writes under the existing admin RLS; why: visitors see saved changes without introducing a second permission path.
- Every product has its own public page at `/produto/$slug` (`src/routes/produto.$slug.tsx`), the slug coming from `slugDeProduto(nome)` in `src/lib/produtos.ts`; why: cards and "outras peças" link by name-based URL, so a new product needs no extra route.
- In a `createFileRoute` object declare `loader` before `head` whenever `head` reads `loaderData`; why: with `head` first TypeScript infers the loader data as `never`/`undefined` and the typecheck fails.
