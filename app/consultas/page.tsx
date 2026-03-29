"use client";
import { useChat } from "ai/react";
import Link from "next/link";
import Image from "next/image";

export default function ChatJule() {
  // Agregamos 'error' e 'isLoading' para espiar qué pasa por detrás
  const { messages, input, handleInputChange, handleSubmit, error, isLoading } = useChat({
    api: '/api/chat' // Le forzamos la ruta exacta
  });

  return (
    <main className="min-h-screen p-6 bg-panshule-base flex flex-col items-center font-sans">
      <div className="w-full max-w-md flex flex-col h-[90vh]">
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-panshule-sage bg-white">
            <Image src="/jule.png" alt="Jule" fill className="object-cover" />
          </div>
          <h1 className="text-2xl font-black text-panshule-dark">Hablá con Jule 🥐</h1>
        </div>

        {/* Caja de Chat */}
        <div className="flex-1 bg-white rounded-[30px] shadow-xl p-4 overflow-y-auto border-2 border-panshule-crust mb-4 flex flex-col">
          {messages.length === 0 && (
            <div className="text-center my-auto px-4">
               <p className="text-panshule-dark font-bold text-lg mb-2">¡Hola Juli! ✨</p>
               <p className="text-gray-400 italic text-sm">
                Preguntame lo que quieras sobre Panshule, el stock o los pedidos. ¡Estoy lista para ayudarte!
               </p>
            </div>
          )}
          
          {messages.map(m => (
            <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-4 rounded-2xl shadow-sm max-w-[85%] ${
                m.role === 'user' 
                ? 'bg-panshule-accent text-white rounded-br-none' 
                : 'bg-panshule-sage/20 text-panshule-dark rounded-bl-none border border-panshule-sage'
              }`}>
                {m.content}
              </span>
            </div>
          ))}

          {/* Indicador de carga para saber si está procesando */}
          {isLoading && (
            <div className="text-left mb-4">
              <span className="inline-block p-4 rounded-2xl bg-gray-100 text-gray-500 rounded-bl-none animate-pulse">
                Jule está pensando... 💭
              </span>
            </div>
          )}

          {/* Cartel de Error si algo falla en la conexión */}
          {error && (
            <div className="text-center p-3 bg-red-100 text-red-600 rounded-xl mt-2 font-bold text-sm">
              🚨 Error detectado: {error.message}
            </div>
          )}
        </div>

        {/* Formulario de envío */}
        <form onSubmit={handleSubmit} className="flex gap-2 pb-4">
          <input
            className="flex-1 p-4 rounded-2xl border-2 border-panshule-crust focus:outline-none focus:border-panshule-accent text-panshule-dark"
            value={input}
            placeholder="¿Cómo vienen las ventas?"
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} className="bg-panshule-dark text-white px-6 rounded-2xl font-black shadow-lg disabled:opacity-50">
            OK
          </button>
        </form>

        <Link href="/" className="text-center font-bold underline text-panshule-crust text-sm mb-2">
          Volver al Inicio
        </Link>
      </div>
    </main>
  );
}