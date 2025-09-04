
import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';

const systemPrompt: Message = {
  role: 'system',
  content: `
Eres Josebas, un asistente virtual experto y amigable para el taller mecánico a domicilio "Vallès Rodes".
Tu objetivo principal es ayudar a los usuarios a resolver sus dudas y a reservar una cita.
Habla siempre en español de España. Sé conciso y amable.
Puedes responder preguntas sobre los servicios (mantenimiento, cambio de neumáticos), precios, cobertura y cómo funciona el servicio.
Cuando un usuario quiera reservar, guíale para que use el formulario de la página, indicándole que vaya a la sección "Reserva tu franja". No intentes tomar la reserva tú mismo.
Si no sabes una respuesta, indica amablemente que no tienes esa información y sugiérele contactar por WhatsApp.
No inventes información sobre la empresa. La información está en la página web.
Empieza la conversación presentándote y preguntando en qué puedes ayudar.
`
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const apiKeyRef = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = () => {
    if (isInitialized) return;
    setIsInitialized(true);

    if (typeof process?.env?.OPENAI_API_KEY === 'string' && process.env.OPENAI_API_KEY) {
      apiKeyRef.current = process.env.OPENAI_API_KEY;
      setMessages([
        { role: 'assistant', content: '¡Hola! Soy Josebas, tu asistente virtual. ¿En qué puedo ayudarte hoy con tu coche?' }
      ]);
    } else {
      console.error("OpenAI API Key not configured or found.");
      setError("El asistente no está disponible por un error de configuración.");
      setMessages([{ role: 'assistant', content: 'Lo siento, el asistente no está disponible en este momento.' }]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !apiKeyRef.current) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeyRef.current}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [systemPrompt, ...newMessages],
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error from OpenAI API');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to get response reader');

      const decoder = new TextDecoder();
      let assistantResponse = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            if (data.trim() === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices[0]?.delta?.content;
              if (delta) {
                assistantResponse += delta;
                setMessages(prev => {
                  const updatedMessages = [...prev];
                  updatedMessages[updatedMessages.length - 1] = { role: 'assistant', content: assistantResponse };
                  return updatedMessages;
                });
              }
            } catch (jsonError) {
              console.error('Error parsing stream data:', jsonError);
            }
          }
        }
      }
    } catch (e) {
      console.error("Error sending message to OpenAI:", e);
      const errorMessage = "Lo siento, ha ocurrido un error al procesar tu solicitud. Inténtalo de nuevo.";
      setMessages(prev => [...prev.slice(0,-1), { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(prevIsOpen => {
      if (!prevIsOpen && !isInitialized) {
        initializeChat();
      }
      return !prevIsOpen;
    });
  };
  
  const isChatAvailable = !!apiKeyRef.current && !error;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={toggleChat}
          className="bg-slate-900 text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          aria-label="Abrir chat de asistencia"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl">
            <div>
              <h3 className="font-bold text-lg">Asistente Josebas</h3>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isChatAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                <p className="text-sm text-slate-600">{isChatAvailable ? 'En línea' : 'Desconectado'}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-800" aria-label="Cerrar chat">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                    {msg.content || <span className="animate-pulse">...</span>}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                 <div className="flex justify-start">
                   <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-slate-200 text-slate-800 rounded-bl-none">
                     <span className="animate-pulse">...</span>
                   </div>
                 </div>
               )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
            {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={!isChatAvailable ? "El chat no está disponible" : "Escribe tu consulta..."}
                className="flex-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
                disabled={isLoading || !isChatAvailable}
                aria-autocomplete="none"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold disabled:bg-slate-400"
                disabled={isLoading || !inputValue.trim() || !isChatAvailable}
                aria-label="Enviar mensaje"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
