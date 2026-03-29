import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-panshule-base">
      <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-panshule-crust text-center max-w-sm w-full">
        
        {/* El avatar de Jule */}
        <div className="mx-auto w-32 h-32 relative mb-6 rounded-full overflow-hidden border-4 border-panshule-base shadow-inner bg-panshule-sage/20">
          <Image 
            src="/jule.png" /* Asegúrate de que el nombre coincida con tu imagen */
            alt="Jule de Panshule" 
            fill 
            className="object-cover"
          />
        </div>

        <h1 className="text-3xl font-bold text-panshule-dark mb-2">
          ¡Hola, Juli! 🥐
        </h1>
        <p className="text-base text-panshule-crust font-medium mb-6">
          Soy Jule. ¿Qué vamos a hornear (o calcular) hoy?
        </p>

        {/* Un botón de prueba para el futuro */}
        <button className="w-full bg-panshule-accent text-white font-bold py-3 px-4 rounded-xl shadow-md hover:opacity-90 transition-opacity">
          Entrar al Sistema
        </button>

      </div>
    </main>
  );
}