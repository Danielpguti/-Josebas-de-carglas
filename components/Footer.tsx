
import React from 'react';
import { PHONE_NUMBER } from '../constants';

interface FooterProps {
  whatsappUrl: string;
  phoneUrl: string;
}

const Footer: React.FC<FooterProps> = ({ whatsappUrl, phoneUrl }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-slate-200/70 bg-white">
      <div className="container mx-auto px-4 text-sm text-slate-600 grid md:grid-cols-3 gap-4 items-center">
        <div>
          <div className="font-bold">Vallès Rodes</div>
          <div>CIF/NIF ———— · Taller móvil y recogida</div>
          <div>Santa Eulàlia de Ronçana (Vallès Oriental)</div>
        </div>
        <div>
          <div>Tel: <a href={phoneUrl} className="underline">{PHONE_NUMBER}</a></div>
          <div>WhatsApp: <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline">{PHONE_NUMBER}</a></div>
          <div>Email: <a href="mailto:info@vallesrodes.com" className="underline">info@vallesrodes.com</a></div>
        </div>
        <div className="text-xs text-slate-500">© {year} Vallès Rodes. Todos los derechos reservados.</div>
      </div>
    </footer>
  );
};

export default Footer;
