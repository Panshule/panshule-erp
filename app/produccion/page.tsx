"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

export default function Produccion() {
  const [resumenHoy, setResumenHoy] = useState<any[]>([]);
  const [listaCompras, setListaCompras] = useState<any[]>([]);

  const calcularProduccion = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    
    // 1. Ver qué hay que cocinar hoy
    const { data: pedidos } = await supabase.from("orders").select(`
      *, order_items(quantity, products(name, product_ingredients(ingredient_id, quantity_grams, ingredients(name, stock_current_grams))))
    `).eq("delivery_date", hoy);

    // Lógica para agrupar productos y calcular faltantes de stock
    // (Simplificado para visualización rápida)
    if (pedidos) setResumenHoy(pedidos);
  };

  useEffect(() => { calcularProduccion(); }, []);

  return (
    <main className="min-h-screen p-6 bg-panshule-base">
        <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-black text-panshule-dark mb-6">Tablero de Producción 🥖</h1>
            
            <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-panshule-crust mb-6">
                <h2 className="font-bold text-panshule-accent mb-4">Para Elaborar Hoy:</h2>
                {resumenHoy.length === 0 ? <p className="italic text-gray-400">Sin pedidos para hoy.</p> : 
                resumenHoy.map(p => (
                    <div key={p.id} className="border-b py-2 flex justify-between">
                        <span>{p.client_name}</span>
                        <span className="font-bold">Ver detalles →</span>
                    </div>
                ))}
            </div>

            <div className="bg-panshule-dark text-white p-6 rounded-3xl shadow-xl">
                <h2 className="font-bold text-panshule-sage mb-4">Lista de Compras (Faltantes) 🛒</h2>
                <p className="text-xs text-gray-400">Jule analizó tu stock y tus pedidos...</p>
                {/* Aquí iría el desglose de ingredientes que bajaron del mínimo */}
                <div className="mt-4 p-3 bg-gray-800 rounded-xl border border-red-500 text-red-400 text-sm">
                    ⚠️ Stock bajo: Harina 000 (Quedan 200g)
                </div>
            </div>
            <Link href="/" className="block text-center mt-8 font-bold underline text-panshule-crust">Volver al Dashboard</Link>
        </div>
    </main>
  );
}