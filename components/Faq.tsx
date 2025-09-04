
import React from 'react';

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <details className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
        <summary className="font-semibold cursor-pointer">{question}</summary>
        <div className="mt-2 text-slate-700">{children}</div>
    </details>
);

const Faq: React.FC = () => {
    return (
        <section className="py-12 md:py-16 bg-white border-t border-slate-200/70">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-extrabold">Preguntas frecuentes</h2>
                <div className="mt-6 grid md:grid-cols-2 gap-6 text-slate-800">
                    <FaqItem question="¿Qué incluye el mantenimiento “desde 250 €”?">
                        <p>Mano de obra + checklist de 30 puntos. Los recambios (aceite, filtros, etc.) se presupuestan aparte y se aprueban por WhatsApp antes de empezar.</p>
                    </FaqItem>
                    <FaqItem question="¿La recogida/entrega tiene coste?">
                        <p>Incluida en los municipios definidos en cobertura. Fuera de zona, aplicamos un suplemento por km (te lo diremos antes de confirmar).</p>
                    </FaqItem>
                    <FaqItem question="¿Cambian neumáticos en garajes?">
                        <p>Sí, si hay ventilación, luz y espacio. Si no, lo hacemos en la calle cumpliendo la normativa local.</p>
                    </FaqItem>
                    <FaqItem question="¿Cuánto tarda el cambio de neumáticos?">
                        <p>Entre 60 y 120 minutos según tamaño de llanta y número de ruedas.</p>
                    </FaqItem>
                    <FaqItem question="¿Necesito estar presente?">
                        <p>No para recogida/entrega. Para cambio a domicilio sí necesitamos acceso y confirmación al finalizar.</p>
                    </FaqItem>
                    <FaqItem question="¿Hay coche de sustitución?">
                        <p>Sí, si el retraso es por nuestra causa y según condiciones de la política de puntualidad.</p>
                    </FaqItem>
                </div>
            </div>
        </section>
    );
};

export default Faq;
