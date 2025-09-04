
import React from 'react';

interface StickyMobileActionsProps {
  whatsappUrl: string;
  phoneUrl: string;
}

const StickyMobileActions: React.FC<StickyMobileActionsProps> = ({ whatsappUrl, phoneUrl }) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/90 backdrop-blur border-t border-slate-200">
      <div className="container mx-auto px-4 py-2 flex gap-3">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold">
          WhatsApp
        </a>
        <a href={phoneUrl} className="flex-1 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-semibold">
          Llamar
        </a>
      </div>
    </div>
  );
};

export default StickyMobileActions;
