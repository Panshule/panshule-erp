"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

export default function Ventas() {
  const [productos, setProductos] = useState<any[]>([]);
  const [cliente, setCliente] = useState("");
  const [carrito, setCarrito] = useState<{id: string, name: string, cant: number, precio: number}[]>([]);

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.from("products").select("*");
      if (data) setProductos(data);
    };
    cargar();
  }, []);

  const agregarAlCarrito = (p: any) => {
    setCarrito([...carrito, { id: p.id, name: p.name, cant: 1, precio: p.sale_price }]);
  };

  const confirmarVenta = async () => {
    if (!cliente || carrito.length === 0) return alert("Faltan datos");

    // 1. Crear el Pedido
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cant), 0);
    const { data: pedido, error } = await supabase.from("orders").insert([{ 
      client_name: cliente, 
      total_amount: total, 
      status: 'completado' 
    }]).select().single();

    if (pedido) {
      // 2. Por cada producto, descontar ingredientes del stock
      for (const item of carrito) {
        const { data: receta } = await supabase.from("product_ingredients")
          .select("ingredient_id, quantity_grams").eq("product_id", item.id);
        
        if (receta) {
          for (const ing of receta) {
            const gastoTotal = ing.quantity_grams * item.cant;
            // Descontar en Supabase (usamos una función RPC o update simple)
            const { data: s } = await supabase.from("ingredients").select("stock_current_grams").eq("id", ing.ingredient_id).single();
            if (s) {
                await supabase.from("ingredients").update({ 
                    stock_current_grams: s.stock_current_grams - gastoTotal 
                }).eq("id", ing.ingredient_id);
            }
          }
        }
      }
      alert("¡Venta realizada! El stock de Panshule se actualizó.");
      setCarrito([]); setCliente("");
    }
  };

  return (
    <main className="min-h-screen p-6 bg-panshule-base flex flex-col items-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-black text-panshule-dark mb-6 text-center">Registrar Venta 🛒</h1>
        
        <input type="text" placeholder="Nombre del Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)}
          className="w-full p-4 mb-4 rounded-2xl border-2 border-panshule-crust shadow-sm" />

        <h2 className="font-bold text-panshule-crust mb-2">Productos Disponibles:</h2>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {productos.map(p => (
            <button key={p.id} onClick={() => agregarAlCarrito(p)} className="bg-white p-3 rounded-xl border-2 border-panshule-sage text-sm font-bold">
              {p.name} (${p.sale_price})
            </button>
          ))}
        </div>

        <div className="bg-panshule-dark text-white p-6 rounded-[30px] shadow-xl">
          <h2 className="font-bold text-xl mb-4 border-b border-gray-600 pb-2">Tu Pedido:</h2>
          {carrito.map((c, i) => (
            <div key={i} className="flex justify-between mb-2">
              <span>{c.name} x1</span>
              <span className="font-bold">${c.precio}</span>
            </div>
          ))}
          <div className="text-right text-2xl font-black mt-4 text-panshule-sage">
            Total: ${carrito.reduce((acc, item) => acc + item.precio, 0)}
          </div>
          <button onClick={confirmarVenta} className="w-full bg-panshule-accent mt-4 py-4 rounded-2xl font-black text-lg">
            FINALIZAR VENTA
          </button>
        </div>
        <Link href="/" className="block text-center mt-6 font-bold text-panshule-crust underline">Cancelar</Link>
      </div>
    </main>
  );
}