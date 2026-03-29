"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Link from "next/link";

export default function Recetas() {
  const [ingredientes, setIngredientes] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  
  // Para la receta
  const [itemsReceta, setItemsReceta] = useState<{id: string, cant: number}[]>([]);

  const cargarDatos = async () => {
    const { data: ing } = await supabase.from("ingredients").select("*");
    const { data: prod } = await supabase.from("products").select("*, product_ingredients(ingredient_id, quantity_grams)");
    if (ing) setIngredientes(ing);
    if (prod) setProductos(prod);
  };

  const agregarFila = () => setItemsReceta([...itemsReceta, { id: "", cant: 0 }]);

  const guardarProducto = async (e: any) => {
    e.preventDefault();
    // 1. Crear el producto
    const { data: newProd, error: pError } = await supabase
      .from("products")
      .insert([{ name: nombreProducto, sale_price: Number(precioVenta) }])
      .select()
      .single();

    if (newProd) {
      // 2. Insertar los ingredientes de la receta
      const relations = itemsReceta.map(item => ({
        product_id: newProd.id,
        ingredient_id: item.id,
        quantity_grams: item.cant
      }));
      await supabase.from("product_ingredients").insert(relations);
      alert("¡Producto y Receta guardados!");
      setNombreProducto(""); setPrecioVenta(""); setItemsReceta([]);
      cargarDatos();
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  return (
    <main className="min-h-screen p-6 bg-panshule-base flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-panshule-dark">Recetas y Costos ⚖️</h1>
          <Link href="/" className="text-panshule-accent font-bold underline">Inicio</Link>
        </div>

        <form onSubmit={guardarProducto} className="bg-white p-6 rounded-3xl shadow-lg border-2 border-panshule-crust mb-8">
          <h2 className="text-xl font-bold text-panshule-dark mb-4">Crear Nuevo Producto</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input type="text" placeholder="Nombre (Ej: Wrap Pollo)" value={nombreProducto} 
              onChange={(e) => setNombreProducto(e.target.value)} className="p-3 border rounded-xl bg-panshule-base/20" required />
            <input type="number" placeholder="Precio Venta ($)" value={precioVenta} 
              onChange={(e) => setPrecioVenta(e.target.value)} className="p-3 border rounded-xl bg-panshule-base/20" required />
          </div>

          <h3 className="font-bold text-panshule-crust mb-2">Ingredientes de la Receta:</h3>
          {itemsReceta.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select className="flex-1 p-2 border rounded-lg bg-white" 
                onChange={(e) => {
                  const newItems = [...itemsReceta];
                  newItems[index].id = e.target.value;
                  setItemsReceta(newItems);
                }}>
                <option value="">Seleccionar...</option>
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
          <button type="button" onClick={agregarFila} className="text-sm text-panshule-crust font-bold mb-4">+ Añadir ingrediente</button>

          <button type="submit" className="w-full bg-panshule-dark text-white font-bold py-3 rounded-xl shadow-md">
            Guardar Producto
          </button>
        </form>

        <h2 className="text-2xl font-bold text-panshule-dark mb-4">Tus Productos</h2>
        <div className="grid gap-4">
          {productos.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-2xl border border-panshule-crust shadow-sm flex justify-between">
              <span className="font-bold text-lg">{p.name}</span>
              <span className="font-bold text-panshule-accent text-lg">${p.sale_price}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}