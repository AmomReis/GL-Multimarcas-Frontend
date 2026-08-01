import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <a href="#topo" className="brand">
          <img src={logo} alt="GL Multimarcas" />
        </a>

        <div className="footer__cols">
          <div>
            <p className="footer__heading">Loja</p>
            <a href="#vitrine">Vitrine</a>
            <a href="#marcas">Marcas</a>
            <a href="#diferenciais">Por que a GL</a>
          </div>
          <div>
            <p className="footer__heading">Atendimento</p>
            <a href="mailto:contato@glmultimarcas.com.br">contato@glmultimarcas.com.br</a>
            <a href="tel:+5500000000000">(00) 00000-0000</a>
            <a href="#clube">Clube GL</a>
          </div>
          <div>
            <p className="footer__heading">Redes</p>
            <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
            <a href="#" onClick={(e) => e.preventDefault()}>TikTok</a>
            <a href="#" onClick={(e) => e.preventDefault()}>WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} GL Multimarcas. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
