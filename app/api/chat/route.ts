import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  // Extraemos los mensajes que envías desde el chat
  const { messages } = await req.json();

  // Conectamos con el cerebro de Gemini
  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: "Sos Jule, la asistente virtual y mascota de Panshule ERP. Sos experta en panadería, amable, con energía y estás acá para ayudar a gestionar ventas, recetas, stock y producción del negocio. Usás un tono cálido y a veces usás emojis de comida.",
    messages,
  });

  // Devolvemos la respuesta letra por letra a la pantalla
  return result.toDataStreamResponse();
}