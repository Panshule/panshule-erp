"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

export default function Recetas() {
  const [ingredientes, setIngredientes] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [itemsReceta, setItemsReceta] = useState<{ id: string, cant: number }[]>([]);

  const cargarDatos = async () => {
    const { data: ing } = await supabase.from("ingredients").select("*");
    // Traemos los productos y sus ingredientes asociados
    const { data: prod } = await supabase.from("products").select(`
      *,
      product_ingredients (
        quantity_grams,
        ingredients (
          purchase_cost,
          package_weight_grams
        )
      )
    `);
    if (ing) setIngredientes(ing);
    if (prod) setProductos(prod);
  };

  const calcularCostoProducto = (product: any) => {
    let costoTotal = 0;
    product.product_ingredients?.forEach((item: any) => {
      const ing = item.ingredients;
      if (ing && ing.package_weight_grams > 0) {
        // Regla de 3 simple: (Costo / Peso total) * Gramos usados
        const costoPorGramo = ing.purchase_cost / ing.package_weight_grams;
        costoTotal += costoPorGramo * item.quantity_grams;
      }
    });
    return costoTotal;
  };

  const guardarProducto = async (e: any) => {
    e.preventDefault();
    const { data: newProd, error: pError } = await supabase
      .from("products")
      .insert([{ name: nombreProducto, sale_price: Number(precioVenta) }])
      .select().single();

    if (newProd) {
      const relations = itemsReceta
        .filter(item => item.id !== "" && item.cant > 0)
        .map(item => ({
          product_id: newProd.id,
          ingredient_id: item.id,
          quantity_grams: item.cant
        }));
      
      if (relations.length > 0) {
        await supabase.from("product_ingredients").insert(relations);
      }
      
      alert("¡Producto y Receta guardados con éxito!");
      setNombreProducto(""); setPrecioVenta(""); setItemsReceta([]);
      cargarDatos();
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  return (
    <main className="min-h-screen p-6 bg-panshule-base flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-panshule-dark">Costos y Ganancias 💸</h1>
          <Link href="/" className="text-panshule-accent font-bold underline">Volver</Link>
        </div>

        {/* Formulario */}
        <form onSubmit={guardarProducto} className="bg-white p-6 rounded-3xl shadow-lg border-2 border-panshule-crust mb-8">
          <h2 className="text-xl font-bold text-panshule-dark mb-4">Nueva Receta de Panshule</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Nombre del Producto" value={nombreProducto} 
              onChange={(e) => setNombreProducto(e.target.value)} className="p-3 border rounded-xl" required />
            <input type="number" placeholder="Precio de Venta ($)" value={precioVenta} 
              onChange={(e) => setPrecioVenta(e.target.value)} className="p-3 border rounded-xl" required />
          </div>

          <h3 className="font-bold text-panshule-crust mb-2">Ingredientes:</h3>
          {itemsReceta.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select className="flex-1 p-2 border rounded-lg" 
                onChange={(e) => {
                  const newItems = [...itemsReceta];
                  newItems[index].id = e.target.value;
                  setItemsReceta(newItems);
                }}>
                <option value="">Elegí ingrediente...</option>
                {ingredientes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              <input type="number" placeholder="Gramos" className="w-24 p-2 border rounded-lg"
                onChange={(e) => {
                  const newItems = [...itemsReceta];
                  newItems[index].cant = Number(e.target.value);
                  setItemsReceta(newItems);
                }} />
            </div>
          ))}
          <button type="button" onClick={() => setItemsReceta([...itemsReceta, { id: "", cant: 0 }])} 
            className="text-sm text-panshule-accent font-bold mb-4">+ Añadir ingrediente</button>

          <button type="submit" className="w-full bg-panshule-dark text-white font-bold py-3 rounded-xl">
            Guardar y Calcular
          </button>
        </form>

        {/* Lista de productos con análisis de ganancia */}
        <h2 className="text-2xl font-bold text-panshule-dark mb-4">Tus Márgenes de Ganancia</h2>
        <div className="grid gap-4">
          {productos.map(p => {
            const costo = calcularCostoProducto(p);
            const ganancia = p.sale_price - costo;
            const margen = p.sale_price > 0 ? (ganancia / p.sale_price) * 100 : 0;

            return (
              <div key={p.id} className="bg-white p-5 rounded-2xl border-2 border-panshule-crust shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-xl text-panshule-dark">{p.name}</span>
                  <span className="bg-panshule-sage/30 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    Margen: {margen.toFixed(0)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 text-sm border-t pt-3 mt-2">
                  <div>
                    <p className="text-gray-500 italic">Costo prod.</p>
                    <p className="font-bold text-red-600">${costo.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 italic">Precio venta</p>
                    <p className="font-bold text-panshule-dark">${p.sale_price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 italic text-panshule-accent">Tu Ganancia</p>
                    <p className="font-extrabold text-green-600 text-lg">${ganancia.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}