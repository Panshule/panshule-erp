"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [totalSemanal, setTotalSemanal] = useState(0);
  const [totalAyer, setTotalAyer] = useState(0);

  const cargarDatos = async () => {
    const { data: todos } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (todos) setPedidos(todos);

    const hoy = new Date();
    const sieteDiasAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { data: semanal } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", sieteDiasAtras.toISOString());
    const sumaSeman = semanal?.reduce((acc, p) => acc + (p.total_amount || 0), 0) || 0;
    setTotalSemanal(sumaSeman);

    const ayerInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1, 0, 0, 0);
    const ayerFin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1, 23, 59, 59);
    const { data: ayer } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", ayerInicio.toISOString())
      .lte("created_at", ayerFin.toISOString());
    const sumaAyer = ayer?.reduce((acc, p) => acc + (p.total_amount || 0), 0) || 0;
    setTotalAyer(sumaAyer);
  };

  useEffect(() => { cargarDatos(); }, []);

  return (
    <main className="min-h-screen p-6 bg-panshule-base flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-panshule-dark">Reporte 📋</h1>
          <Link href="/" className="text-panshule-accent font-bold underline">Inicio</Link>
        </div>

        <div className="bg-panshule-dark text-white p-6 rounded-[30px] shadow-xl mb-8">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Ingresos Panshule (7 días)</p>
          <p className="text-5xl font-black text-panshule-sage mb-5">${totalSemanal.toLocaleString()}</p>
          <div className="grid grid-cols-2 gap-3 border-t border-gray-600 pt-4">
            <div>
              <p className="text-xs text-gray-400">Total de Ayer</p>
              <p className="text-xl font-bold">${totalAyer.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Ventas Totales</p>
              <p className="text-xl font-bold">{pedidos.length}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-panshule-dark mb-4">Historial</h2>
        <div className="space-y-4">
          {pedidos.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-2xl shadow-md border-b-4 border-panshule-crust flex justify-between items-center">
              <div>
                <p className="text-xl font-black text-panshule-dark">{p.client_name || "Cliente"}</p>
                <p className="text-[10px] text-gray-400">
                  {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-panshule-accent">${p.total_amount}</p>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}