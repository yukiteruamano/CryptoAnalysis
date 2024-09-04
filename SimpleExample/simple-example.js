import { configDotenv } from "dotenv";
import { Mistral } from "@mistralai/mistralai";

// Cargamos nuestro .env donde tenemos almacenada la API de Mistral
// CUIDADO: Esta API es personal, mantenla protegida, esto es un ejemplo
configDotenv();

// Cargamos las API keys con el fin de conectarnos al servicio
const apiKey = process.env.MISTRAL_API_KEY;

// Creamos nuestra interfaz cliente con el fin de comunicarnos con Mistral AI
const client = new Mistral({apiKey: apiKey});

// Enviamos la información a Mistral AI y obtenemos la respuesta
const chatResponse = await  client.chat.complete(
  {
    model: 'mistral-large-latest',
    messages: [{ role: 'user',
                 content: 'Explica en español que es Bitcoin y como funciona'}],
  }
);

// Mostrams la respuesta por consola
console.log('Chat:', chatResponse.choices[0].message.content);
