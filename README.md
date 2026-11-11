# GL Multimarcas · Frontend

Loja online e painel administrativo em React. O projeto conecta catálogo, carrinho, checkout de convidado e operação de pedidos a uma API própria em Java.

[Loja](https://gl-multimarcas-frontend.vercel.app/) · [Backend](https://github.com/AmomReis/GL-Multimarcas-Backend) · [Arquitetura](docs/ARCHITECTURE.md) · [Contribuição](CONTRIBUTING.md)

## Funcionalidades

- Catálogo, detalhes dos produtos e carrinho persistido no navegador.
- Checkout sem conta de cliente, consulta de CEP e redirecionamento ao Mercado Pago.
- Consulta de status público do pedido após o pagamento.
- Login administrativo e gestão de produtos, marcas, promoções, pedidos e envios.
- Carregamento separado das páginas administrativas com React.lazy.

## Stack

React 18, React Router 6, Vite 7, JavaScript e CSS. A API utiliza Spring Boot e PostgreSQL.

## Executar localmente

Requer Node.js compatível com Vite 7 (22.12 ou superior) e npm.

```sh
npm ci
```

Copie `.env.example` para `.env` e configure `VITE_API_URL=http://localhost:8080`, sem `/api` no final. No PowerShell: `Copy-Item .env.example .env`.

```sh
npm run dev
npm run build
npm run preview
```

O desenvolvimento usa a porta 5173. Configure o backend e a origem CORS correspondente. Variáveis VITE são públicas e incorporadas no build: nunca coloque tokens de pagamentos ou senhas nelas.

## Rotas

| Área | Rotas |
| --- | --- |
| Loja | `/`, `/loja`, `/produto/:id` |
| Compra | `/carrinho`, `/checkout`, `/pagamento/:resultado` |
| Administração | `/admin/entrar`, `/admin` |
| Gestão | `/admin/produtos`, `/admin/marcas`, `/admin/promocoes`, `/admin/pedidos`, `/admin/envios` |

## Organização

| Diretório | Responsabilidade |
| --- | --- |
| `src/pages` | Fluxos da loja e páginas administrativas |
| `src/layouts` | Estruturas da loja e administração |
| `src/context` | Carrinho, sessão administrativa e mensagens |
| `src/lib/api.js` | HTTP, token, tratamento de erros e URLs de imagens |
| `src/components` | Componentes reutilizáveis |
| `src/styles` | Estilos específicos |

## Publicação e verificação

`npm run build` gera `dist/`. O host deve redirecionar as rotas da SPA para `index.html`; há configuração em `vercel.json`. Configure VITE_API_URL antes do build.

Verifique catálogo, persistência do carrinho, login, sessão expirada, checkout com credenciais de teste e retorno de pagamento. O repositório não contém uma suíte automatizada de frontend; build bem-sucedido não comprova integrações externas.

Não use uma URL de retorno do provedor como confirmação de pagamento. O estado deve ser consultado na API.
