import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-panshule-base font-sans text-panshule-dark">
      <div className="bg-white p-8 rounded-[40px] shadow-xl border-b-8 border-panshule-crust text-center max-w-md w-full">
        
        {/* El avatar de Jule */}
        <div className="mx-auto w-28 h-28 relative mb-4 rounded-full overflow-hidden border-4 border-panshule-sage shadow-md bg-panshule-sage/20">
          <Image src="/jule.png" alt="Jule" fill className="object-cover" />
        </div>

        <h1 className="text-3xl font-black mb-1 italic">PANSHULE ERP</h1>
        <p className="text-sm text-panshule-crust font-bold mb-6 italic">"Donde cada gramo cuenta"</p>

        <div className="grid gap-3">
          
          {/* BOTÓN IA - JULE (Nuevo) */}
          <Link href="/chat" className="w-full bg-yellow-400 text-panshule-dark font-black py-4 rounded-2xl border-b-4 border-yellow-700 shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform">
            ✨ PREGUNTALE A JULE (IA)
          </Link>

          {/* BOTÓN VENTAS */}
          <Link href="/ventas" className="w-full bg-panshule-accent text-white font-black py-4 rounded-2xl shadow-lg border-b-4 border-red-700 hover:scale-105 transition-transform text-lg">
            🛒 NUEVA VENTA
          </Link>
          
          {/* FILA 1: DESPENSA Y RECETAS */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/stock" className="bg-panshule-sage text-green-900 font-bold py-3 rounded-2xl border-b-4 border-green-700 shadow-sm">
              📦 Despensa
            </Link>
            <Link href="/recetas" className="bg-panshule-dark text-white font-bold py-3 rounded-2xl border-b-4 border-black shadow-sm">
              ⚖️ Recetas
            </Link>
          </div>

          {/* FILA 2: PRODUCCIÓN Y GASTOS */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/produccion" className="bg-orange-400 text-white font-bold py-3 rounded-2xl border-b-4 border-orange-700 shadow-sm">
              🥖 Producción
            </Link>
            <Link href="/gastos" className="bg-red-400 text-white font-bold py-3 rounded-2xl border-b-4 border-red-700 shadow-sm">
              💸 Gastos
            </Link>
          </div>

          {/* ESTADÍSTICAS Y HISTORIAL */}
          <div className="grid grid-cols-1 gap-2 mt-2">
            <Link href="/dashboard" className="w-full bg-indigo-500 text-white font-black py-3 rounded-2xl border-b-4 border-indigo-800 shadow-sm">
              📈 Estadísticas Reales
            </Link>
            <Link href="/pedidos" className="w-full bg-white text-panshule-dark border-2 border-panshule-crust font-bold py-3 rounded-2xl shadow-sm text-sm">
              📋 Ver Historial de Pedidos
            </Link>
          </div>
          
        </div>
      </div>
    </main>
  );
}