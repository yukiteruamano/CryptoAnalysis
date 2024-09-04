import express from 'express';
import fileUpload from 'express-fileupload';
import { configDotenv } from 'dotenv';
import { Mistral } from '@mistralai/mistralai';
import cors from 'cors';

configDotenv();

// Cargamos las API keys con el fin de conectarnos al servicio
const apiKey = process.env.MISTRAL_API_KEY;

// Abrimos una sesión cliente con Mistral
const client = new Mistral({ apiKey: apiKey });

// Cargamos express con el fin de exponer nuestro endpoint API
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Ruta para manejar la solicitud
app.post('/api/chat', async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send({ error: 'No se ha subido ningún archivo.' });
    }

    const model = req.body.model;
    const file = req.files.file;

    // Aquí puedes procesar el archivo CSV como necesites
    // Por simplicidad, solo leeremos el contenido del archivo
    const fileContent = file.data.toString('utf8');

    // Agregamos el contenido de la variable de entorno cryptoCA
    const cryptoCA = process.env.CRYPTO_CA || 'No se definió cryptoCA';
    const updatedContent = `${fileContent}\n\nInformación adicional:\nCryptoCA: ${cryptoCA}`;

    try {
        const chatResponse = await client.chat.complete({
            model: model,
            messages: [{ role: 'user', content: updatedContent }]
        });

        console.log('Chat:', chatResponse.choices[0].message.content);
        res.send({ response: chatResponse.choices[0].message.content });
    } catch (error) {
        console.error('Error al comunicarse con Mistral:', error);
        res.status(500).send({ error: 'Error al comunicarse con Mistral.' });
    }
});

// Servir archivos estáticos
app.use(express.static('public'));

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
