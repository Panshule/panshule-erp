"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

export default function GestionPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarPedidos = async () => {
    setCargando(true);
    // Traemos los pedidos ordenados por fecha de entrega (los más urgentes primero)
    const { data } = await supabase
      .from("orders")
      .select(`
        id, 
        client_name, 
        delivery_date, 
        total_amount, 
        status, 
        payment_status,
        order_items(quantity, products(name))
      `)
      .order("delivery_date", { ascending: true });

    if (data) setPedidos(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Función para cambiar si está en el horno, listo, etc.
  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    await supabase.from("orders").update({ status: nuevoEstado }).eq("id", id);
    cargarPedidos(); // Recargamos para ver el cambio
  };

  // Función para cambiar si pagó o debe
  const actualizarPago = async (id: number, nuevoPago: string) => {
    await supabase.from("orders").update({ payment_status: nuevoPago }).eq("id", id);
    cargarPedidos();
  };

  return (
    <main className="min-h-screen p-6 bg-panshule-base font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-panshule-dark">Torre de Control 📋</h1>
          <Link href="/" className="font-bold underline text-panshule-crust">Volver</Link>
        </div>

        {cargando ? (
          <p className="text-center font-bold text-gray-500">Cargando comandas...</p>
        ) : pedidos.length === 0 ? (
          <div className="bg-white p-8 rounded-[30px] shadow-lg text-center">
            <p className="text-gray-400 font-bold">No hay pedidos registrados todavía.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white p-5 rounded-[25px] shadow-md border-l-8 border-panshule-sage flex flex-col md:flex-row gap-4 justify-between">
                
                {/* Info del Cliente y Pedido */}
                <div className="flex-1">
                  <h2 className="text-xl font-black text-panshule-dark">{pedido.client_name}</h2>
                  <p className="text-sm font-bold text-gray-500 mb-2">
                    📅 Entrega: {new Date(pedido.delivery_date).toLocaleDateString('es-AR')}
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3">
                    <p className="text-xs font-bold text-panshule-crust uppercase mb-1">Detalle a producir:</p>
                    <ul className="text-sm">
                      {pedido.order_items?.map((item: any, i: number) => (
                        <li key={i}>• {item.quantity}x {item.products?.name}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="font-black text-green-700 text-lg">Total: ${pedido.total_amount}</p>
                </div>

                {/* Botonera de Estados */}
                <div className="flex flex-col gap-2 min-w-[180px]">
                  <p className="text-xs font-bold text-gray-400 uppercase text-center">Estado Producción</p>
                  <select 
                    className="p-2 rounded-xl border-2 border-gray-200 font-bold text-sm bg-gray-50 cursor-pointer outline-none"
                    value={pedido.status || "Pendiente"}
                    onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                  >
                    <option value="Pendiente">⏳ Pendiente</option>
                    <option value="En Produccion">🍳 En Producción</option>
                    <option value="Listo">✅ Listo</option>
                    <option value="Enviado">🚚 Enviado</option>
                    <option value="Entregado">🏠 Entregado</option>
                  </select>

                  <p className="text-xs font-bold text-gray-400 uppercase text-center mt-2">Estado de Pago</p>
                  <select 
                    className={`p-2 rounded-xl border-2 font-bold text-sm cursor-pointer outline-none ${
                      pedido.payment_status === 'Pagado' ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700'
                    }`}
                    value={pedido.payment_status || "Falta Pagar"}
                    onChange={(e) => actualizarPago(pedido.id, e.target.value)}
                  >
                    <option value="Falta Pagar">❌ Falta Pagar</option>
                    <option value="Señado">💳 Señado (50%)</option>
                    <option value="Pagado">💰 Pagado Total</option>
                  </select>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}