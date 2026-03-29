import Image from "next/image";
import Link from "next/link"; // Importamos Link para poder navegar

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-panshule-base">
      <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-panshule-crust text-center max-w-sm w-full">
        
        {/* El avatar de Jule */}
        <div className="mx-auto w-32 h-32 relative mb-6 rounded-full overflow-hidden border-4 border-panshule-base shadow-inner bg-panshule-sage/20">
          <Image 
            src="/jule.png" // Asumimos que jule.png está en la carpeta /public
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

        {/* El botón NUEVO que te lleva a la despensa (/stock) */}
        <Link href="/stock" className="block w-full bg-panshule-accent text-white font-bold py-3 px-4 rounded-xl shadow-md hover:opacity-90 transition-opacity">
          Entrar a la Despensa
        </Link>
<Link href="/recetas" className="block w-full mt-3 bg-panshule-dark text-white font-bold py-3 px-4 rounded-xl shadow-md hover:opacity-90 transition-opacity">
  Calcular Recetas
</Link>
      </div>
    </main>
  );
}