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
            <a href="tel:+559186206409">(91) 8620-6409</a>
            <a href="#clube">Clube GL</a>
          </div>
          <div>
            <p className="footer__heading">Redes</p>
            <a href="https://www.instagram.com/glmultimarcas0fc/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@glmultimarcas" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://wa.me/559186206409" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
          <div>
            <p className="footer__heading text-gold-sweep">Desenvolvedor <br/> Amom Reis</p>
            <a href="https://www.instagram.com/amom_reis/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://wa.me/559185236610" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} GL Multimarcas. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
