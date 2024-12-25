const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const app = express();
// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Rutas
app.get('/', (req, res) => {
res.render('pages/index');
// res.send("hola");
});
app.post('/index', async (req, res) => {
try {
const usuario = req.body;
await guardarUsuario(usuario);
res.json({ success: true, message: 'Usuario registrado exitosamente' });
} catch (error) {
res.status(500).json({ success: false, message: error.message });
}
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Servidor corriendo en puerto ${PORT}`);
});