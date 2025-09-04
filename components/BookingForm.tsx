
import React, { useState, useEffect, useCallback } from 'react';
import type { TireOption, TireSize } from '../types';

// Helper functions moved inside the component or to a separate utils file
const parseSize = (s: string): TireSize | null => {
  if (!s) return null;
  const m = s.toUpperCase().replace(/\s+/g, '').match(/(\d{3})\/(\d{2})R(\d{2})/);
  if (!m) return null;
  return { width: +m[1], aspect: +m[2], rim: +m[3] };
};

const priceFromSize = (size: TireSize): number => {
  const basePriceMap: { [key: number]: number } = { 14: 55, 15: 65, 16: 75, 17: 90, 18: 110, 19: 130, 20: 160 };
  const base = basePriceMap[size.rim] || 85;
  const widthAdj = (size.width - 185) * 0.3;
  return Math.max(45, Math.round(base + widthAdj));
};

interface BookingFormProps {
    whatsappUrl: string;
}

const TireOptionCard: React.FC<{ option: TireOption }> = ({ option }) => (
    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
        <div className="flex items-baseline justify-between">
            <div className="font-bold">{option.tier}</div>
            <div className="text-lg font-extrabold">{option.price} €</div>
        </div>
        <div className="mt-1 text-sm text-slate-600">Plazo: {option.eta}</div>
        <div className="mt-2 text-slate-700">{option.notes}</div>
        <button type="button" className="mt-3 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm font-semibold">
            Elegir {option.tier}
        </button>
    </div>
);


const BookingForm: React.FC<BookingFormProps> = ({ whatsappUrl }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    service: 'mantenimiento',
    model: '',
    plate: '',
    tireSize: '',
    date: '',
    start: '',
    end: '',
    address: '',
    replacementCar: false,
    accept: false,
  });
  const [formMsg, setFormMsg] = useState('');
  const [tireOptions, setTireOptions] = useState<TireOption[]>([]);
  const [parsedTireSize, setParsedTireSize] = useState<TireSize | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const renderTireOptions = useCallback(() => {
    const isTireService = formData.service === 'neumaticos';
    const size = parseSize(formData.tireSize);
    setParsedTireSize(size);

    if (!isTireService || !size) {
      setTireOptions([]);
      return;
    }
    
    const base = priceFromSize(size);
    const options: TireOption[] = [
      { tier: 'Alta gama', price: base + 40, eta: '24–48 h', notes: 'Prestaciones y durabilidad' },
      { tier: 'Óptimo', price: base, eta: '24 h', notes: 'Mejor calidad-precio' },
      { tier: 'Económico', price: Math.max(39, base - 20), eta: '48–72 h', notes: 'Ahorro' },
    ];
    setTireOptions(options);
  }, [formData.service, formData.tireSize]);


  useEffect(() => {
    renderTireOptions();
  }, [renderTireOptions]);
  

  const validateWindow = () => {
    const { start, end } = formData;
    if (!start || !end) return true;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const minutes = (eh * 60 + em) - (sh * 60 + sm);
    return minutes >= 360; // 6h
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateWindow()) {
      alert('La franja debe ser de al menos 6 horas.');
      return;
    }
    console.log('Form submitted:', formData);
    setFormMsg('¡Gracias! Recibirás confirmación por WhatsApp en breve.');
  };

  return (
    <section id="reserva" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-extrabold">Reserva tu franja</h2>
          <p className="mt-2 text-slate-700">Franja mínima de <strong>6 horas</strong>. Confirmamos por WhatsApp lo antes posible.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 grid md:grid-cols-2 gap-6">
          {/* Form fields */}
          <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold">Nombre y apellidos</label>
              <input required name="name" value={formData.name} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Daniel Porta" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Teléfono / WhatsApp</label>
              <input required name="phone" value={formData.phone} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="+34 6XX XXX XXX" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="danielpguti@gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Municipio</label>
              <input required name="city" value={formData.city} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Santa Eulàlia de Ronçana" />
            </div>
          </div>

          <div className="md:col-span-2 grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold">Servicio</label>
              <select required name="service" value={formData.service} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
                <option value="mantenimiento">Mantenimiento programado</option>
                <option value="neumaticos">Cambio de neumáticos a domicilio</option>
                <option value="recogida">Recogida y entrega (en taller)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold">Marca y modelo</label>
              <input name="model" value={formData.model} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="VW Golf 1.6 TDI" />
            </div>
            <div>
              <label className="block text-sm font-semibold">Matrícula (opcional)</label>
              <input name="plate" value={formData.plate} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="1234-ABC" />
            </div>
          </div>
          
          <div className="md:col-span-2 grid md:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-semibold">Medida neumático (si aplica)</label>
                <input name="tireSize" value={formData.tireSize} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="205/55 R16" />
            </div>
            <div>
                <label className="block text-sm font-semibold">Fecha</label>
                <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
            </div>
            <div>
                <label className="block text-sm font-semibold">Franja horaria (inicio)</label>
                <input required type="time" name="start" value={formData.start} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
            </div>
            </div>

            <div className="md:col-span-2 grid md:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-semibold">Franja horaria (fin)</label>
                <input required type="time" name="end" value={formData.end} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-semibold">Dirección (recogida o servicio)</label>
                <input required name="address" value={formData.address} onChange={handleInputChange} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="C/ Exemplo 123, Santa Eulàlia de Ronçana" />
            </div>
            </div>

            <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
            <label className="inline-flex items-start gap-3 text-sm text-slate-700">
                <input type="checkbox" name="replacementCar" checked={formData.replacementCar} onChange={handleInputChange} className="mt-1 rounded border-slate-300" />
                <span>Necesito <strong>coche de sustitución</strong> si hay retraso por vuestra causa.</span>
            </label>
            <label className="inline-flex items-start gap-3 text-sm text-slate-700">
                <input type="checkbox" name="accept" required checked={formData.accept} onChange={handleInputChange} className="mt-1 rounded border-slate-300" />
                <span>Acepto los <a href="#" className="underline">términos</a> y la <a href="#" className="underline">política de puntualidad</a>.</span>
            </label>
            </div>

          {/* Tire options */}
          {tireOptions.length > 0 && (
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-slate-200 p-6 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Opciones de neumáticos para <span id="tireSizeLabel">{parsedTireSize ? `${parsedTireSize.width}/${parsedTireSize.aspect} R${parsedTireSize.rim}`: ''}</span></h3>
                  <span className="text-sm text-slate-500">Precios estimados · stock local</span>
                </div>
                <div className="mt-4 grid md:grid-cols-3 gap-4">
                  {tireOptions.map(option => <TireOptionCard key={option.tier} option={option} />)}
                </div>
              </div>
            </div>
          )}

          <div className="md:col-span-2 flex items-center gap-3">
            <button type="submit" className="inline-flex px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold">Enviar reserva</button>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex px-5 py-3 rounded-xl border border-slate-300 font-semibold">Pedir presupuesto por WhatsApp</a>
            {formMsg && <span className="text-sm text-emerald-700">{formMsg}</span>}
          </div>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
