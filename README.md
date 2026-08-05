# GL Multimarcas

Loja online em React + Vite, integrada à API real do backend Spring.

## Como rodar

```bash
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:8080 (sem /api no final)
npm run dev
```

O front roda em `http://localhost:5173` — é a origem liberada no CORS do backend.

## Rotas do site

| Caminho          | Página                                      |
|-------------------|----------------------------------------------|
| `/`               | Home (hero, banners, marcas, destaques)      |
| `/loja`           | Catálogo completo, com filtro por categoria  |
| `/produto/:id`    | Detalhe do produto                           |
| `/carrinho`       | Sacola de compras                            |
| `/checkout`       | Dados do cliente e endereço (pagamento acontece no Mercado Pago) |
| `/pagamento/:resultado` | Retorno do Mercado Pago (`sucesso`, `pendente`, `falha`) |

Não há login — o checkout é feito informando os dados do cliente diretamente
no formulário (`cliente`, `enderecoEntrega`, `itens`). **Não há mais campos de
cartão no front**: o pagamento (Pix, cartão ou boleto) acontece inteiramente
no Checkout Pro do Mercado Pago, pra quem o cliente é redirecionado depois de
confirmar o pedido.

## Endpoints usados (`src/lib/api.js`)

- `GET  /api/produtos?categoria=&destaque=` — **atenção**: se os dois filtros forem
  enviados juntos, o backend prioriza `destaque` e ignora `categoria`. O front
  nunca manda os dois ao mesmo tempo.
- `GET  /api/produtos/{id}`
- `POST /api/pedidos/checkout` — cria o pedido e a *preference* no Mercado
  Pago; deve devolver o link de pagamento (init_point) dentro de `pagamento`
- `GET  /api/pedidos` / `GET /api/pedidos/{id}` — usado em `/pagamento/:resultado`
  pra reconsultar o status real do pedido (a URL de retorno do Mercado Pago
  não é fonte confiável sozinha)

Categorias: `CAMISA`, `BERMUDA`, `CALCA`, `SANDALIA`, `TENIS`, `RELOGIO`,
`OCULOS`, `ANEL`, `BONE`, `COLAR` — rótulos em português em `CATEGORIA_LABEL`
(`src/lib/api.js`).

**Não usados ainda pelo storefront** (fazem parte da API mas são de admin,
não de cliente final): `POST /api/produtos` (multipart, cria produto com
imagem), `PUT /api/produtos/{id}`, `DELETE /api/produtos/{id}`. Se você quiser
um painel administrativo depois, é só pedir — a base do `api.js` já está pronta
pra receber essas chamadas.

### Formato de erro

O backend retorna `ProblemDetail` (`{ type, title, status, detail }`). O
front já lê `detail` e mostra direto pro usuário nos formulários.

### Resposta do checkout (Mercado Pago Checkout Pro)

O front espera que `POST /api/pedidos/checkout` devolva o pedido criado com
o link de pagamento (init_point da preference) dentro de `pagamento`:

```json
{
  "id": 123,
  "total": 209.90,
  "pagamento": {
    "linkPagamento": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
  }
}
```

✅ **Contrato confirmado contra o backend real** (`Backend-GL-Multimarcas`,
`PedidoController` + `GatewayPagamentoService` + `PagamentoResponse`): o
backend usa o SDK oficial do Mercado Pago pra criar a *preference* de
Checkout Pro e devolve o link em `pagamento.linkPagamento` (via
`preference.getInitPoint()`), exatamente a primeira chave que
`extrairLinkPagamento()` (`src/lib/api.js`) tenta — as demais variações
(`initPoint`, `init_point`, `sandboxInitPoint`) continuam aí só de
segurança. Os DTOs de request (`ClienteRequest`, `EnderecoEntregaRequest`,
`PedidoItemRequest`) também batem campo a campo com o payload que este
front monta. Depois que o pedido é criado, o front chama
`window.location.assign(link)` e redireciona o cliente pro Mercado Pago —
não há mais tela de Pix ou formulário de cartão dentro do site.

O webhook (`MercadoPagoWebhookController`, rota `/webhook/mercadopago`) já
reconsulta o pagamento na API do Mercado Pago e atualiza o status do
pedido (`PAGO`, `CANCELADO`, `AGUARDANDO_PAGAMENTO`) — é essa reconsulta via
`GET /api/pedidos/{id}` que a tela de retorno usa, não o webhook direto.

⚠️ O que não é possível confirmar só pelo código: se as variáveis de
ambiente `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_NOTIFICATION_URL` e
`MERCADOPAGO_BACK_URL_{SUCCESS,PENDING,FAILURE}` estão de fato configuradas
no ambiente de deploy — no código elas só existem como `${...}` (Spring
`@Value`), sem valor hardcoded.

Quando o Mercado Pago redireciona de volta (`back_urls` da preference), o
front usa `external_reference` pra reconsultar `GET /api/pedidos/{id}` e
mostrar o status real (ver `PagamentoRetorno.jsx`). Configure as
`back_urls` da preference como `/pagamento/sucesso`, `/pagamento/pendente` e
`/pagamento/falha`, com `external_reference` = id do pedido.

### Imagens

`imagemUrl` pode vir como caminho relativo (upload salvo em `/uploads/...`).
`montarUrlImagem()` em `src/lib/api.js` completa a URL com o host do backend
quando necessário — usado em todo lugar que mostra imagem de produto.

Se a API estiver fora do ar, a vitrine cai automaticamente para os dados de
exemplo em `src/data/products.js`, só pra não travar o front durante o
desenvolvimento.

## Carrinho

`src/context/CartContext.jsx` — guardado no `localStorage`, sobrevive a
refresh da página. Cada item guarda `id` (usado como `produtoId` no
checkout), `nome`, `marca`, `preco`, `categoria`, `imagemUrl` e `quantidade`.

## Onde editar

- `src/data/products.js` e `src/data/promos.js` — dados de exemplo/banners.
- `src/components/` — seções e componentes reutilizáveis.
- `src/pages/` — cada rota da aplicação.
- `src/index.css` — cores, fontes e visual (tokens no topo do arquivo).
- `src/assets/logo.png` — logo da loja (aparece no Hero e no rodapé).

## Build de produção

```bash
npm run build
npm run preview
```

## Refactor mobile (2026-07)

- Grid de produtos em 2 colunas no celular, alvo de toque mínimo de 44px em
  botões/chips/controles de quantidade, `viewport-fit=cover` + `env(safe-area-inset-*)`
  pra respeitar notch/ilha dinâmica e barra de gestos do iPhone.
- Inputs com `font-size: 16px` (evita o zoom automático do Safari iOS ao
  focar um campo) e `inputMode`/`autoComplete` corretos pra abrir o teclado
  certo em cada campo do checkout.
- Busca automática de endereço por CEP (ViaCEP) no checkout, pra reduzir
  digitação no celular.
- Carrossel de promoções com swipe por toque (as setas somem em telas
  pequenas, dá pra arrastar).
- Breakpoints em 768px, 560px e 380px (antes só existia um, em 560px).

## Login

Não existe conta de cliente nem cadastro público — o checkout é sempre
feito sem login (ver seção "Rotas do site" acima). O único login do site
é o do painel administrativo, em `/admin/entrar` (`AdminLogin.jsx`),
fora da navegação do cliente. `AuthContext.jsx`/`AuthProvider` existem só
pra sustentar essa sessão de admin.
