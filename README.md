# FM SOLAR

Site em Next.js App Router, TypeScript e Tailwind CSS. Inclui Home, calculadora com Recharts, portfólio dinâmico e painel com Supabase Auth, PostgreSQL e Storage privado. Sem obras fictícias, senhas no código ou service role.

## Executar

Requer Node.js 22.13+ e npm. Instale com `npm ci`. Copie `.env.example` para `.env.local` e preencha os valores abaixo. Inicie com `npm run dev` e abra http://localhost:3000.

No PowerShell com execução de scripts bloqueada, use `npm.cmd` em vez de `npm`.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_OU_PUBLISHABLE
NEXT_PUBLIC_SITE_URL=https://seudominio.com.br
```

Sem Supabase configurado, Home e calculadora funcionam, o portfólio fica vazio e o login permanece desabilitado. Reinicie o servidor após alterar variáveis. O domínio de produção deve ser definido antes do build.

## Supabase

1. Crie um projeto em https://supabase.com/dashboard. Em Settings → API, copie Project URL e a chave pública (anon/publishable). Nunca use `service_role`.
2. No SQL Editor, execute integralmente `supabase/migrations/001_initial.sql`, depois `002_admin_functions.sql` e `003_atomic_save.sql`. Execute uma única vez em banco novo. Para banco existente, revise conflitos antes de aplicar.
3. As migrations criam tabelas, constraints, índices, triggers, funções, RLS e o bucket **privado** `obras` com limite de 10 MB e JPEG/PNG/WebP. Não torne esse bucket público.
4. Em Authentication → Providers → Email, desative novos cadastros públicos. O site não possui cadastro.
5. Em Authentication → URL Configuration, defina a Site URL de produção. Ative os controles de proteção e limites de login disponíveis no seu projeto.

### Primeiro administrador

Em Authentication → Users → Add user → Create new user, crie o usuário com e-mail e senha forte. Confirme o e-mail pelo painel. Copie o UUID do usuário e execute no SQL Editor:

```sql
insert into public.profiles (id, role)
values ('COLE-O-UUID-DO-USUARIO-AQUI'::uuid, 'admin')
on conflict (id) do update set role = excluded.role;
```

Entre em `/admin`. Somente um usuário presente em `profiles` com papel `admin` pode gerenciar obras. Usuários não podem atribuir papéis pela API. Para revogar acesso, remova a linha correspondente de `profiles`.

## Publicar obras

Em **Nova obra**, preencha título e dados. Salve como rascunho para obter o registro e habilitar uploads. Selecione várias fotos ou arraste arquivos. As imagens são decodificadas no navegador, redimensionadas para até 2400 px e convertidas para WebP com qualidade de 86%; o servidor valida MIME, assinatura e tamanho. Limite de 100 fotos por obra.

Organize pela alça (mouse/touch), pelas setas ou com espaço e setas no teclado. Defina capa, texto alternativo, legenda e fotos antes/depois. **Salve** para confirmar organização. A capa é uma única referência no projeto, protegida por chave estrangeira composta; não há booleanos redundantes de capa.

Use **Visualizar prévia** para visualizar o último estado salvo, inclusive rascunhos. A prévia exige autorização no servidor. Para publicar, informe resumo, cidade e UF. Home e portfólio consultam o banco a cada requisição: não exigem novo deploy. Imagens passam por rota sem cache e autorização RLS, inclusive depois de despublicar.

Duplicação cria somente os dados em novo rascunho, sem fotos e sem destaque. Exclusão exige confirmação, move a obra para rascunho, remove arquivos via Storage API e só depois remove o registro. Se houver falha parcial, o registro permanece para nova tentativa; algumas fotos podem já ter sido removidas. Uploads são persistidos imediatamente, enquanto legendas, ordem e referências são confirmadas ao salvar. Não há autosave; existe aviso de alterações não salvas.

## Identidade e cálculo

Edite `config/company.ts` para contatos, domínio e logo. A imagem original encontrada está em `public/2d.jpeg`; é exibida sem distorção de proporção. Para substituir, adicione `public/logo-fm-solar.png` e altere `company.logo`.

Premissas da calculadora ficam em `config/solarCalculator.ts`; fórmulas em `lib/solarCalculator.ts`. Tipo de imóvel e ligação são dados do lead, sem multiplicadores artificiais. O acumulado considera reajuste anual de 8%; payback é simples. Números e depoimentos da Home foram fornecidos pelo solicitante.

## Qualidade

A edição salva dados, publicação, capa e organização das fotos em uma única transação no banco. As migrations também são testadas localmente com PostgreSQL via PGlite, incluindo RLS e papéis. Esse teste não substitui a validação com o serviço Supabase real.

```sh
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Os testes públicos cobrem calculadora, parâmetro de conta, WhatsApp, proteção sem sessão, menu e overflow em 320, 375, 390, 430, 768, 1024, 1280, 1440 e 1920 px. O fluxo real de Auth/Storage depende de projeto Supabase configurado e administrador; não confundir testes locais com essa validação.

Após configurar, valide: login → nova obra → múltiplas fotos → reordenação → capa → rascunho → prévia → publicação → listagem pública → edição → despublicação → confirmação de indisponibilidade pública → republicação → exclusão. Teste também com usuário autenticado sem papel admin e em janela anônima.

## Produção

Hospede em ambiente compatível com Next.js/Node (por exemplo Vercel ou servidor Node), configure as três variáveis e execute `npm run build`. Em servidor Node, execute `npm start` atrás de HTTPS. Configure domínio e backups no Supabase. Não use exportação estática: login, upload, imagens privadas e publicações exigem servidor.

Fontes técnicas: [Next.js](https://nextjs.org/docs), [Supabase Storage e RLS](https://supabase.com/docs/guides/storage/security/access-control).
