import express from 'express';
import { configDotenv } from 'dotenv';
import { Mistral } from '@mistralai/mistralai';
import cors from 'cors';

// Cargamos nuestro .env donde tenemos almacenada la API de Mistral
configDotenv();

// Cargamos las API keys con el fin de conectarnos al servicio
const apiKey = process.env.MISTRAL_API_KEY;

// Abrimos una sesión cliente con Mistral
const client = new Mistral({ apiKey: apiKey });

// Cargamos express con el fin de exponer nuestro endpoint API
const app = express();
app.use(cors());
app.use(express.json());

// Realizamos nuestra consulta usando la api/chat
app.post('/api/chat', async (req, res) => {
    const { model, question } = req.body;

    try {
        const chatResponse = await client.chat.complete({
            model: model,
            messages: [{ role: 'user', content: question }],
        });

        res.json({ answer: chatResponse.choices[0].message.content });
    } catch (error) {
        console.error('Error en la consulta a Mistral:', error);
        res.status(500).json({ error: 'Error al comunicarse con Mistral AI' });
    }
});

// Express estará escuchando todo por localhost:3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
