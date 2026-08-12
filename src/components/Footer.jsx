import { Link } from 'react-router-dom'
import { IconWhatsApp, IconInstagram } from './icons'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Link to="/" className="brand" aria-label="GL Multimarcas — início">
            <img src={logo} alt="GL Multimarcas" />
          </Link>
          <p className="footer__tagline">
            Moda multimarcas para quem manda no próprio estilo.
          </p>
          <div className="footer__social">
            <a
              href="https://wa.me/559186206409"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-btn"
              aria-label="WhatsApp da GL Multimarcas"
            >
              <IconWhatsApp aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/glmultimarcas0fc/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-btn"
              aria-label="Instagram da GL Multimarcas"
            >
              <IconInstagram aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="footer__cols">
          <div>
            <p className="footer__heading">Loja</p>
            {/* Link do router com hash (e não <a href="#...">): assim o
                atalho também funciona a partir de /loja ou /carrinho, em
                vez de procurar a âncora na página errada. */}
            <Link to="/loja">Catálogo</Link>
            <Link to="/loja?destaque=1">Ofertas</Link>
            <Link to="/#marcas">Marcas</Link>
            <Link to="/#diferenciais">Por que a GL</Link>
          </div>
          <div>
            <p className="footer__heading">Atendimento</p>
            <a href="mailto:contato@glmultimarcas.com.br">contato@glmultimarcas.com.br</a>
            <a href="tel:+559186206409">(91) 8620-6409</a>
            <Link to="/#clube">Clube GL</Link>
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
