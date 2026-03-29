"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase"; // Asegurate que esta ruta sea correcta según tu utils/supabase.ts
import Link from "next/link";

export default function Stock() {
  const [ingredientes, setIngredientes] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  const [costo, setCosto] = useState("");
  const [peso, setPeso] = useState("");

  // Función para cargar los ingredientes de Supabase
  const cargarIngredientes = async () => {
    // ingredients es el nombre de la tabla que creamos en Supabase
    const { data, error } = await supabase.from("ingredients").select("*").order("name");
    if (data) setIngredientes(data);
  };

  // Función para agregar un ingrediente nuevo
  const agregarIngrediente = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from("ingredients").insert([
      {
        name: nombre,
        unit: "g", // Gramos por defecto
        package_weight_grams: Number(peso),
        purchase_cost: Number(costo),
        stock_current_grams: Number(peso), // Stock inicial = peso total
      },
    ]);

    if (!error) {
      setNombre(""); setCosto(""); setPeso("");
      cargarIngredientes(); // Recargamos la lista
      alert("¡Ingrediente guardado con éxito en Supabase!");
    } else {
      console.error(error);
      alert("Hubo un error al guardar en la base de datos.");
    }
  };

  // Cargar al inicio
  useEffect(() => {
    cargarIngredientes();
  }, []);

  return (
    <main className="min-h-screen p-6 bg-panshule-base flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-panshule-dark">Despensa 📦</h1>
          <Link href="/" className="text-panshule-accent font-bold underline">Volver al Inicio</Link>
        </div>

        {/* Formulario */}
        <form onSubmit={agregarIngrediente} className="bg-white p-6 rounded-2xl shadow-md border-2 border-panshule-crust mb-8">
          <h2 className="text-xl font-bold text-panshule-dark mb-4">Nuevo Ingrediente</h2>
          
          <input type="text" placeholder="Nombre (Ej: Harina 000)" value={nombre} onChange={(e) => setNombre(e.target.value)} required
            className="w-full p-3 mb-3 border rounded-xl bg-panshule-base/30 text-panshule-dark" />
          
          <div className="flex gap-3 mb-4">
            <input type="number" placeholder="Costo Total ($)" value={costo} onChange={(e) => setCosto(e.target.value)} required
              className="w-1/2 p-3 border rounded-xl bg-panshule-base/30 text-panshule-dark" />
            <input type="number" placeholder="Peso Paquete (g)" value={peso} onChange={(e) => setPeso(e.target.value)} required
              className="w-1/2 p-3 border rounded-xl bg-panshule-base/30 text-panshule-dark" />
          </div>

          <button type="submit" className="w-full bg-panshule-sage text-green-900 font-bold py-3 rounded-xl shadow-sm hover:opacity-90">
            + Agregar Ingrediente
          </button>
        </form>

        {/* Lista de stock */}
        <h2 className="text-2xl font-bold text-panshule-dark mb-4">Stock Actual</h2>
        <div className="space-y-3">
          {ingredientes.length === 0 ? (
            <p className="text-center text-panshule-crust italic">Tu despensa en la nube está vacía.</p>
          ) : (
            ingredientes.map((ing) => (
              <div key={ing.id} className="bg-white p-4 rounded-xl shadow-sm border border-panshule-crust flex justify-between items-center">
                <div>
                  <p className="font-bold text-panshule-dark text-lg">{ing.name}</p>
                  <p className="text-sm text-gray-500">Costo: ${ing.purchase_cost} | Envase: {ing.package_weight_grams}g</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-panshule-accent">{ing.stock_current_grams}g</p>
                  <p className="text-xs text-gray-400">En stock nuble</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}