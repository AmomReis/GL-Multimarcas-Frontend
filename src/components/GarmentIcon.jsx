// Ícones de fallback por categoria — usados quando o produto não tem imagemUrl.
const paths = {
  CAMISA: <path d="M24 8 14 16l3 9 7-4v37h24V21l7 4 3-9L48 8l-8 5h-8Z" />,
  BERMUDA: <path d="M18 8h28l2 22 3 18h-11l-4-22-4 22H21l3-18Z" />,
  CALCA: <path d="M18 8h28l2 30 4 22h-11l-5-30-5 30H20l4-22Z" />,
  SANDALIA: (
    <path d="M8 44h40c2 0 4 2 4 4s-2 4-4 4H8a4 4 0 0 1 0-8Z M14 44V30c0-4 3-8 8-8h6c5 0 8 4 8 8v14 M30 22V14" />
  ),
  TENIS: <path d="M8 46h4c1-4 4-6 8-6l14-10c4-3 8-4 12-3l10 4c3 1 4 3 4 6v9H8Z" />,
  RELOGIO: (
    <path d="M24 14h16l1 7h-18Z M24 50h16l1-7h-18Z M32 18a14 14 0 1 0 0.1 0Z M32 25v8l6 4" />
  ),
  OCULOS: (
    <path d="M8 28c2-4 6-6 10-6s8 2 10 6 M36 28c2-4 6-6 10-6s8 2 10 6 M18 28a8 8 0 1 0 0.1 0Z M46 28a8 8 0 1 0 0.1 0Z M26 30h12" />
  ),
  ANEL: <path d="M32 44a14 14 0 1 0 0.1 0Z M32 30 26 16h12Z" />,
  BONE: <path d="M8 40c0-13 11-24 24-24s24 11 24 24H44a12 12 0 0 0-24 0Z M32 12v6" />,
  COLAR: (
    <path d="M12 12c2 16 12 26 20 26s18-10 20-26 M32 38v6l-4 6h8l-4-6" />
  ),
}

export default function GarmentIcon({ type, className }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {paths[type] || paths.CAMISA}
    </svg>
  )
}
