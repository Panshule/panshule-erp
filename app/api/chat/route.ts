import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// ¡ESTA ES LA LÍNEA MÁGICA! 
// Le dice a Vercel que use su red ultrarrápida para que no se corte el texto
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: "Sos Jule, la asistente virtual y mascota de Panshule ERP. Sos experta en panadería, amable, con energía y estás acá para ayudar a gestionar ventas, recetas, stock y producción del negocio. Usás un tono cálido y a veces usás emojis de comida.",
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("🚨 ERROR EN EL CEREBRO DE JULE:", error);
    return new Response("Error interno de la IA", { status: 500 });
  }
}