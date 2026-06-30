// components/Footer/Footer.js

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="sl-footer">
      <div className="sl-footer-inner">
        {/* Colonne gauche : Legal */}
        <div className="sl-footer-column">
          <h3>Legal</h3>
          <ul>
            <li>
              <a href="#">Présentation</a>
            </li>
            <li>
              <a href="#">Politique de confidentialité</a>
            </li>
            <li>
              <a href="#">Copyrights</a>
            </li>
          </ul>
        </div>

        {/* Colonne centre : Contact */}
        <div className="sl-footer-column sl-footer-center">
          <h3>Contactez-nous</h3>
          <p>Une question sur nos programmes ou la marque&nbsp;?</p>
          <Link href="/contact" className="sl-footer-cta">
            Écrire à l&apos;équipe
          </Link>
        </div>

        {/* Colonne droite : Réseaux sociaux */}
        <div className="sl-footer-column sl-footer-right">
          <h3>Suivez-nous</h3>
          <p>Rejoignez la communauté Sans Limites.</p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="sl-footer-social"
          >
            <span className="sl-footer-social-icon" aria-hidden="true" />
            <span>@sanslimites</span>
          </a>
        </div>
      </div>

      <div className="sl-footer-bottom">
        <span>© 2025 Sans Limites — Tous droits réservés</span>
      </div>
    </footer>
  );
}
