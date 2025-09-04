
import React from 'react';

const Cta: React.FC = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold">¿Listo para ahorrar tiempo?</h2>
        <p className="mt-2 text-slate-700">Reserva hoy y te lo recogemos al entrar a trabajar. Te lo devolvemos al salir.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="#reserva" className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold">Reservar ahora</a>
          <a href="#" className="px-6 py-3 rounded-xl border border-slate-300 font-semibold">WhatsApp</a>
        </div>
      </div>
    </section>
  );
};

export default Cta;
