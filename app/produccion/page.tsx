"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

export default function Produccion() {
  const [resumenHoy, setResumenHoy] = useState<any[]>([]);
  const [faltantes, setFaltantes] = useState<any[]>([]);

  const calcularProduccion = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    
    // 1. Ver qué hay que cocinar hoy
    const { data: pedidos } = await supabase.from("orders").select(`
      *, order_items(quantity, products(name, product_ingredients(ingredient_id, quantity_grams, ingredients(name, stock_current_grams))))
    `).eq("delivery_date", hoy);

    if (pedidos) {
      setResumenHoy(pedidos);

      // 2. Calculadora real de insumos
      let insumosNecesarios: Record<string, { requerido: number, stock: number }> = {};
      
      pedidos.forEach(p => {
        p.order_items?.forEach((item: any) => {
          item.products?.product_ingredients?.forEach((pi: any) => {
            const ingName = pi.ingredients?.name;
            const reqGrams = (pi.quantity_grams || 0) * (item.quantity || 1);
            const stockActual = pi.ingredients?.stock_current_grams || 0;
            
            if(ingName) {
              if(!insumosNecesarios[ingName]) {
                insumosNecesarios[ingName] = { requerido: 0, stock: stockActual };
              }
              insumosNecesarios[ingName].requerido += reqGrams;
            }
          });
        });
      });

      // 3. Detectar qué nos falta comprar
      let alertas = [];
      for (const [nombre, datos] of Object.entries(insumosNecesarios)) {
        if (datos.stock < datos.requerido) {
          alertas.push(`⚠️ Falta ${nombre}: Necesitás ${datos.requerido}g pero tenés ${datos.stock}g`);
        }
      }
      setFaltantes(alertas);
    }
  };

  useEffect(() => { calcularProduccion(); }, []);

  return (
    <main className="min-h-screen p-6 bg-panshule-base font-sans">
        <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-black text-panshule-dark mb-6">Tablero de Producción 🥖</h1>
            
            <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-panshule-crust mb-6">
                <h2 className="font-bold text-panshule-accent mb-4">Para Elaborar Hoy:</h2>
                {resumenHoy.length === 0 ? <p className="italic text-gray-400">Sin pedidos para hoy.</p> : 
                resumenHoy.map(p => (
                    <div key={p.id} className="border-b py-2 flex justify-between text-panshule-dark">
                        <span>{p.client_name}</span>
                        <span className="font-bold">Ver detalles →</span>
                    </div>
                ))}
            </div>

            <div className="bg-panshule-dark text-white p-6 rounded-3xl shadow-xl">
                <h2 className="font-bold text-panshule-sage mb-2">Lista de Compras (Faltantes) 🛒</h2>
                <p className="text-xs text-gray-400 mb-4">Calculado sobre tus pedidos de hoy y stock actual:</p>
                
                {/* Acá reemplazamos tu texto fijo por las alertas reales */}
                {faltantes.length === 0 ? (
                  <div className="p-3 bg-green-900/50 rounded-xl border border-green-500 text-green-400 text-sm">
                    ✅ ¡Tenés stock suficiente de todo para hoy!
                  </div>
                ) : (
                  faltantes.map((alerta, index) => (
                    <div key={index} className="mt-2 p-3 bg-gray-800 rounded-xl border border-red-500 text-red-400 text-sm font-bold">
                        {alerta}
                    </div>
                  ))
                )}
            </div>
            <Link href="/" className="block text-center mt-8 font-bold underline text-panshule-crust">Volver al Dashboard</Link>
        </div>
    </main>
  );
}