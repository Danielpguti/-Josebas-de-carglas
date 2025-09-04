
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";

// Define message type
interface Message {
  role: 'user' | 'model';
  text: string;
}

// System instruction for Josebas
const systemInstruction = `
Eres Josebas, un asistente virtual experto y amigable para el taller mecánico a domicilio "Vallès Rodes".
Tu objetivo principal es ayudar a los usuarios a resolver sus dudas y a reservar una cita.
Habla siempre en español de España. Sé conciso y amable.
Puedes responder preguntas sobre los servicios (mantenimiento, cambio de neumáticos), precios, cobertura y cómo funciona el servicio.
Cuando un usuario quiera reservar, guíale para que use el formulario de la página, indicándole que vaya a la sección "Reserva tu franja". No intentes tomar la reserva tú mismo.
Si no sabes una respuesta, indica amablemente que no tienes esa información y sugiérele contactar por WhatsApp.
No inventes información sobre la empresa. La información está en la página web.
Empieza la conversación presentándote y preguntando en qué puedes ayudar.
`;

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = async () => {
    try {
      // This check gracefully handles environments where process.env is not available, preventing a crash.
      const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

      if (!apiKey) {
        throw new Error("API_KEY no está configurada en el entorno.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemInstruction,
        },
      });
      setChat(chatSession);

      // Add initial greeting from Josebas
      setMessages([{
        role: 'model',
        text: '¡Hola! Soy Josebas, tu asistente virtual. ¿En qué puedo ayudarte hoy con tu coche?'
      }]);

    } catch (e) {
        console.error("Error initializing chat:", e);
        const errorMessage = e instanceof Error ? e.message : 'Un error desconocido ocurrió.';
        setError(`No se pudo iniciar el chat: ${errorMessage}`);
        setMessages([{
            role: 'model',
            text: 'Lo siento, no puedo conectarme en este momento. Por favor, intenta más tarde.'
        }]);
    }
  };


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !chat) return;

    const userMessage: Message = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
        const stream = await chat.sendMessageStream({ message: inputValue });
        
        let modelResponse = '';
        setMessages(prev => [...prev, { role: 'model', text: '' }]); // Add placeholder for streaming

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                return newMessages;
            });
        }

    } catch (e) {
        console.error("Error sending message:", e);
        const errorMessage = "Lo siento, ha ocurrido un error al procesar tu solicitud. Inténtalo de nuevo.";
        setMessages(prev => {
            const newMessages = [...prev];
            // If the last message was the placeholder, replace it with the error.
            if(newMessages[newMessages.length -1].role === 'model' && newMessages[newMessages.length -1].text === ''){
                 newMessages[newMessages.length - 1] = { role: 'model', text: errorMessage };
                 return newMessages;
            }
            // Otherwise, add a new error message.
            return [...newMessages, { role: 'model', text: errorMessage }];
        });
    } finally {
        setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !chat) {
      // Initialize chat on first open
      initializeChat();
    }
  };

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
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl">
            <div>
                <h3 className="font-bold text-lg">Asistente Josebas</h3>
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${chat ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    <p className="text-sm text-slate-600">{chat ? 'En línea' : 'Desconectado'}</p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-800" aria-label="Cerrar chat">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                    {msg.text || <span className="animate-pulse">...</span>}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={!chat ? "El chat no está disponible" : "Escribe tu consulta..."}
                className="flex-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={isLoading || !chat}
                aria-autocomplete="none"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold disabled:bg-slate-400"
                disabled={isLoading || !inputValue.trim() || !chat}
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
