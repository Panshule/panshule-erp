"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);

  const cargarPedidos = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPedidos(data);
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  return (
    <main className="min-h-screen p-6 bg-panshule-base flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-panshule-dark">Historial 📋</h1>
          <Link href="/" className="text-panshule-accent font-bold underline">Inicio</Link>
        </div>

        <div className="space-y-4">
          {pedidos.length === 0 ? (
            <p className="text-center text-panshule-crust italic">Todavía no registraste ventas.</p>
          ) : (
            pedidos.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-2xl shadow-md border-l-8 border-panshule-sage">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Cliente</p>
                    <p className="text-xl font-black text-panshule-dark">{p.client_name || "Cliente Anónimo"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total</p>
                    <p className="text-xl font-black text-panshule-accent">${p.total_amount}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center border-t pt-3 border-gray-100">
                  <span className="text-[10px] text-gray-400">
                    {new Date(p.created_at).toLocaleDateString()} - {new Date(p.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    {p.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}