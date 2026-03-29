"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

export default function Gastos() {
  const [gastos, setGastos] = useState<any[]>([]);
  const [desc, setDesc] = useState("");
  const [monto, setMonto] = useState("");

  const cargarGastos = async () => {
    const { data } = await supabase.from("expenses").select("*").order("date", { ascending: false });
    if (data) setGastos(data);
  };

  const guardarGasto = async (e: any) => {
    e.preventDefault();
    await supabase.from("expenses").insert([{ description: desc, amount: Number(monto) }]);
    setDesc(""); setMonto("");
    cargarGastos();
  };

  useEffect(() => { cargarGastos(); }, []);

  return (
    <main className="min-h-screen p-6 bg-panshule-base flex flex-col items-center font-sans">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-black text-panshule-dark mb-6">Gastos Extra 💸</h1>
        
        <form onSubmit={guardarGasto} className="bg-white p-6 rounded-3xl shadow-lg border-2 border-panshule-crust mb-8">
          <input type="text" placeholder="Ej: Luz, Gas, Packagings" value={desc} onChange={(e) => setDesc(e.target.value)}
            className="w-full p-3 mb-3 border rounded-xl" required />
          <input type="number" placeholder="Monto ($)" value={monto} onChange={(e) => setMonto(e.target.value)}
            className="w-full p-3 mb-4 border rounded-xl" required />
          <button type="submit" className="w-full bg-red-500 text-white font-black py-3 rounded-xl shadow-md">
            Registrar Gasto
          </button>
        </form>

        <div className="space-y-3">
          {gastos.map(g => (
            <div key={g.id} className="bg-white p-4 rounded-xl border border-panshule-crust flex justify-between">
              <span className="font-bold">{g.description}</span>
              <span className="text-red-600 font-black">-${g.amount}</span>
            </div>
          ))}
        </div>
        <Link href="/" className="block text-center mt-6 font-bold underline">Volver</Link>
      </div>
    </main>
  );
}