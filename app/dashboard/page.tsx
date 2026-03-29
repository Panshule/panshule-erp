"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

export default function Dashboard() {
  const [ingresos, setIngresos] = useState(0);
  const [gastosExtra, setGastosExtra] = useState(0);
  const [costoInsumos, setCostoInsumos] = useState(0);

  const cargarFinanzas = async () => {
    // 1. Obtener Ventas Totales
    const { data: ventas } = await supabase.from("orders").select("total_amount");
    const totalVentas = ventas?.reduce((acc, v) => acc + (v.total_amount || 0), 0) || 0;
    setIngresos(totalVentas);

    // 2. Obtener Gastos Extra (Luz, Gas, etc.)
    const { data: gastos } = await supabase.from("expenses").select("amount");
    const totalGastos = gastos?.reduce((acc, g) => acc + (g.amount || 0), 0) || 0;
    setGastosExtra(totalGastos);

    // 3. Calcular costo de insumos vendidos (Lógica avanzada)
    const { data: pedidos } = await supabase.from("orders").select(`
      id,
      order_items (
        quantity,
        products (
          product_ingredients (
            quantity_grams,
            ingredients (purchase_cost, package_weight_grams)
          )
        )
      )
    `);

    let totalCostoMaterias = 0;
    pedidos?.forEach(p => {
      p.order_items?.forEach((item: any) => {
        item.products?.product_ingredients?.forEach((pi: any) => {
          const ing = pi.ingredients;
          if (ing && ing.package_weight_grams > 0) {
            const costoGramo = ing.purchase_cost / ing.package_weight_grams;
            totalCostoMaterias += (costoGramo * pi.quantity_grams) * item.quantity;
          }
        });
      });
    });
    setCostoInsumos(totalCostoMaterias);
  };

  useEffect(() => { cargarFinanzas(); }, []);

  const gananciaNeta = ingresos - gastosExtra - costoInsumos;

  return (
    <main className="min-h-screen p-6 bg-panshule-base font-sans flex flex-col items-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-black text-panshule-dark mb-6 text-center">Balance Real 📈</h1>

        <div className="bg-white p-8 rounded-[40px] shadow-2xl border-b-8 border-panshule-crust mb-6">
          <p className="text-sm font-bold text-panshule-crust uppercase text-center mb-1">Ganancia Neta Final</p>
          <p className={`text-5xl font-black text-center ${gananciaNeta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${gananciaNeta.toLocaleString()}
          </p>
        </div>

        <div className="grid gap-4">
          <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
            <span className="font-bold text-gray-500">Ventas Totales (+)</span>
            <span className="font-black text-green-600 text-xl">${ingresos.toLocaleString()}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border-l-4 border-red-400">
            <span className="font-bold text-gray-500">Costo Insumos (-)</span>
            <span className="font-black text-red-500">${costoInsumos.toFixed(0)}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border-l-4 border-red-600">
            <span className="font-bold text-gray-500">Gastos Fijos (-)</span>
            <span className="font-black text-red-600">${gastosExtra.toLocaleString()}</span>
          </div>
        </div>

        <Link href="/" className="block text-center mt-10 font-black text-panshule-dark underline decoration-panshule-accent decoration-4">
          VOLVER AL INICIO
        </Link>
      </div>
    </main>
  );
}