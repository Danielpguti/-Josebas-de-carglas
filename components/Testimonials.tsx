
import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-white border-y border-slate-200/70">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold">Lo que dicen nuestros clientes</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <figure className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
            <blockquote className="text-slate-800">“Me lo recogieron al entrar y lo tuve listo al salir. Cero pérdidas de tiempo.”</blockquote>
            <figcaption className="mt-3 text-sm text-slate-600">Marina G. · Granollers · ⭐⭐⭐⭐⭐</figcaption>
          </figure>
          <figure className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
            <blockquote className="text-slate-800">“Cambio de ruedas en mi garaje en 90 minutos. Cómodo y profesional.”</blockquote>
            <figcaption className="mt-3 text-sm text-slate-600">Jordi P. · Parets · ⭐⭐⭐⭐⭐</figcaption>
          </figure>
          <figure className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
            <blockquote className="text-slate-800">“Precio claro y comunicación por WhatsApp impecable.”</blockquote>
            <figcaption className="mt-3 text-sm text-slate-600">Laura S. · Caldes · ⭐⭐⭐⭐⭐</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
