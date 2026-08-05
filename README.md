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

⚠️ **Isso é um formato de exemplo** — eu não tinha acesso ao backend real ao
fazer esse refactor. `extrairLinkPagamento()` em `src/lib/api.js` já tenta
vários nomes de campo comuns (`linkPagamento`, `initPoint`, `init_point`,
`sandboxInitPoint`...), mas vale confirmar/ajustar assim que o contrato do
backend estiver fechado. Depois que o pedido é criado, o front chama
`window.location.assign(link)` e redireciona o cliente pro Mercado Pago —
não há mais tela de Pix ou formulário de cartão dentro do site.

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

## Clube GL / Membros GL (painel admin)

O painel admin (`/admin/membros`) tem uma aba pra mandar uma mensagem de
oferta em massa pra todo mundo que se cadastrou no Clube GL (formulário de
newsletter na Home, seção `#clube`, componente `Newsletter.jsx`).

**Endpoints ainda não confirmados no backend** — eu não tinha acesso ao
backend real, então segui o mesmo padrão do resto do `api.js` (formato de
exemplo, ver `extrairLinkPagamento`/checkout acima): `POST /api/membros`
(cadastra o e-mail vindo do formulário da Home), `GET /api/membros` (lista
os membros pro admin, usado só pra mostrar a contagem) e
`POST /api/membros/oferta` (`{ mensagem }`, dispara o envio em massa).
Ajuste `src/lib/api.js` assim que o contrato real do backend estiver
fechado.

## Notificação de pedido (pago/cancelado)

O pedido é que o cliente receba um aviso por e-mail ou WhatsApp quando o
status do pedido virar `PAGO` ou `CANCELADO`. Isso **precisa acontecer no
backend** (é ele quem tem a integração com o provedor de e-mail/WhatsApp) —
não tem como um front React puro disparar WhatsApp/e-mail sozinho. A
expectativa é que o próprio `PATCH /api/pedidos/{id}/status` (já usado por
`AdminPedidoDetail.jsx` e `AdminPedidos.jsx`) dispare a notificação quando
o novo status for `PAGO` ou `CANCELADO`, usando `cliente.email` e
`cliente.telefone` que já vêm salvos no pedido desde o checkout. O front só
avisa o admin, na tela, de que isso vai acontecer.
