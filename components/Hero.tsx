
import React, { useState, useEffect } from 'react';

interface HeroProps {
  whatsappUrl: string;
}

const Hero: React.FC<HeroProps> = ({ whatsappUrl }) => {
  const [title, setTitle] = useState('Mantenimiento y cambio de neumáticos a domicilio en Vallès Oriental.');
  const [subtitle, setSubtitle] = useState('Te recogemos el coche al entrar a trabajar y te lo devolvemos al salir. O vamos a tu casa y lo hacemos in situ.');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v') || (Math.random() < 0.5 ? '1' : '2');
    if (v === '1') {
      setTitle('Te recogemos el coche al entrar a trabajar y te lo devolvemos al salir.');
      setSubtitle('Mantenimiento y cambio de neumáticos a domicilio en el Vallès Oriental. Reserva tu franja (mín. 6 h).');
    }
    // console.log('ab_variant', { variant: v }); // For tracking
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(30rem_30rem_at_30%_10%,rgba(30,41,59,0.08),transparent),radial-gradient(25rem_25rem_at_80%_0%,rgba(16,185,129,0.08),transparent)]"></div>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 items-center gap-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{title}</h1>
            <p className="mt-4 text-lg md:text-xl text-slate-700">{subtitle}</p>
            <ul className="mt-6 space-y-2 text-slate-700">
              <li className="flex items-start gap-2"><span className="mt-1">✅</span><span><strong>Franja mínima de 6 h</strong> para recogida/entrega puntual.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1">✅</span><span><strong>Mantenimiento desde 250 €</strong> + recambios (aceite, filtros y 30 puntos de control).</span></li>
              <li className="flex items-start gap-2"><span className="mt-1">✅</span><span><strong>Cambio de neumáticos a domicilio</strong> con 3 opciones: Alta gama · Óptimo · Económico (stock local).</span></li>
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <a href="#reserva" className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold">Reservar ahora</a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-xl border border-slate-300 font-semibold">Pedir por WhatsApp</a>
            </div>
            <div className="mt-4 text-sm text-slate-500">Zona: Santa Eulàlia de Ronçana y municipios del Vallès Oriental.</div>
            <div className="mt-4 flex items-center gap-3 text-amber-600">
              <div className="flex items-center gap-1"><span>⭐</span><span>4,8/5</span></div>
              <div className="text-slate-600">+350 servicios en 2025</div>
            </div>
          </div>
          <div className="md:justify-self-end">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Cómo funciona</h3>
              <ol className="mt-3 space-y-3 text-slate-700">
                <li><span className="font-semibold">1)</span> Reserva tu franja (mín. 6 h) y elige <em>recogida</em> o <em>servicio a domicilio</em>.</li>
                <li><span className="font-semibold">2)</span> Vamos a tu trabajo o casa (o recogemos al entrar y devolvemos al salir).</li>
                <li><span className="font-semibold">3)</span> Entrega con informe y garantía. Si el retraso es por nuestra causa, <strong>coche de sustitución</strong> sin coste.</li>
              </ol>
              <a href="#reserva" className="mt-5 inline-flex px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold">Reservar</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
