
import React from 'react';

interface HeaderProps {
  whatsappUrl: string;
  phoneUrl: string;
}

const Header: React.FC<HeaderProps> = ({ whatsappUrl, phoneUrl }) => {
  return (
    <header className="bg-gradient-to-b from-white to-slate-50/60 border-b border-slate-200/60 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">VR</div>
            <div className="text-sm leading-tight">
              <div className="font-bold">Vallès Rodes</div>
              <div className="text-slate-500">Taller a domicilio</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="#reserva" className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold">Reservar</a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold">WhatsApp</a>
            <a href={phoneUrl} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold">Llamar</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
