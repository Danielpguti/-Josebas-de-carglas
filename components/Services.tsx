
import React from 'react';

const Services: React.FC = () => {
  return (
    <section id="servicios" className="py-12 md:py-16 border-t border-slate-200/70 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold">Servicios y precios</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
            <h3 className="text-xl font-bold">Mantenimiento programado</h3>
            <p className="mt-2 text-slate-700">Desde <span className="font-semibold">250 €</span> + recambios. Incluye aceite, filtros y <span className="font-semibold">30 puntos de control</span>. Recogida y entrega incluidas en municipios de cobertura.</p>
            <ul className="mt-4 space-y-1 text-slate-700 list-disc list-inside">
              <li>Presupuesto cerrado antes de empezar</li>
              <li>Informe al entregar el vehículo</li>
            </ul>
            <a href="#reserva" className="mt-5 inline-flex px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">Reservar mantenimiento</a>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
            <h3 className="text-xl font-bold">Cambio de neumáticos a domicilio</h3>
            <p className="mt-2 text-slate-700">Mano de obra desde <span className="font-semibold">60 €/rueda</span> + neumático. Equilibrado incluido. Te proponemos <span className="font-semibold">3 opciones</span> (Alta gama · Óptimo · Económico) con stock local.</p>
            <ul className="mt-4 space-y-1 text-slate-700 list-disc list-inside">
              <li>Servicio en domicilio o trabajo</li>
              <li>Tiempo estimado: 60–120 min</li>
            </ul>
            <a href="#reserva" className="mt-5 inline-flex px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">Reservar cambio de neumáticos</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
