const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar middleware para manejar JSON y datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para servir el formulario de la encuesta
app.get('/', (req, res) => {
    res.send(`
        <h1>Encuesta</h1>
        <form action="/submit" method="POST">
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name" required><br><br>
            <label for="age">Edad:</label>
            <input type="number" id="age" name="age" required><br><br>
            <label for="feedback">Comentarios:</label><br>
            <textarea id="feedback" name="feedback" rows="4" required></textarea><br><br>
            <button type="submit">Enviar</button>
        </form>
    `);
});

// Ruta para manejar la recepción de datos
app.post('/submit', (req, res) => {
    const { name, age, feedback } = req.body;
    const dataPath = path.join('C:\\Users\\Dario\\data', 'responses.json');

    // Crear la carpeta si no existe
    const folderPath = path.dirname(dataPath);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Leer datos existentes
    let responses = [];
    if (fs.existsSync(dataPath)) {
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        responses = JSON.parse(fileContent);
    }

    // Agregar nueva respuesta
    responses.push({ name, age, feedback, timestamp: new Date().toISOString() });

    // Guardar datos
    fs.writeFileSync(dataPath, JSON.stringify(responses, null, 2), 'utf8');

    res.send('<h1>¡Gracias por tu respuesta!</h1><a href="/">Volver</a>');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
