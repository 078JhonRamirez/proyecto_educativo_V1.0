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


async function guardarUsuario(usuario) {
    try {
        const filepath = path.join(__dirname, 'data', 'usuarios.json');
        let usuarios = [];
        try {
            const data = await fs.readFile(filepath, 'utf8');
            usuarios = JSON.parse(data);
        } catch (error) {
            if (error.code == "ENOENT") {
                console.log('El archivo usuarios.json no existe. Se creará uno nuevo.');
                usuarios = [];
            }
        }
        usuarios.push({
            ...usuario,
            id: Date.now(),
            fechaRegistro: new Date().toISOString()
        });
        await fs.writeFile(filepath, JSON.stringify(usuarios, null, 2));
        return true;
    } catch (error) {
        throw new Error('Error al guardar usuario: ' + error.message);
    }
}

// app.get('/buscar-usuario', async (req, res) => {
//     const { nombre } = req.query;

//     if (!nombre) return res.json({ success: false, message: 'El nombre es obligatorio' });

//     try {
//         const filepath = path.join(__dirname, 'data', 'usuarios.json');
//         const usuarios = JSON.parse(await fs.readFile(filepath, 'utf8'));

//         const usuario = usuarios.find(u => u.nombre.toLowerCase() === nombre.toLowerCase());

//         if (usuario) {
//             return res.json({ success: true, usuario });
//         }
//         return res.json({ success: false, message: 'Usuario no encontrado' });
//     } catch (error) {
//         return res.json({ success: false, message: 'Error al procesar la solicitud' });
//     }
// });

app.get('/buscar-usuario', async (req, res) => {
    const { nombre } = req.query; // Obtiene el nombre del query string
    
    if (!nombre) {
        return res.json({ success: false, message: 'El nombre es obligatorio' });
    }

    try {
        const filepath = path.join(__dirname, 'data', 'usuarios.json');

        // Verificar si el archivo existe
        try {
            await fs.access(filepath);
        } catch (error) {
            return res.json({ success: false, message: 'El archivo de usuarios no se encuentra' });
        }

        const data = await fs.readFile(filepath, 'utf8');
        
        if (!data) {
            return res.json({ success: false, message: 'No hay usuarios registrados' });
        }

        const usuarios = JSON.parse(data);
        
        // Depuración: Muestra los usuarios leídos del archivo
        console.log('Usuarios cargados desde archivo:', usuarios);

        // Asegúrate de limpiar espacios en blanco y hacer la comparación en minúsculas
           const usuario = usuarios.find(u => u.nombre.trim().toLowerCase() === nombre.trim().toLowerCase());
        console.log(usuario);
        
        if (usuario) {
            return res.json({ success: true, usuario });
        }

        return res.json({ success: false, message: 'Usuario no encontrado' });
    } catch (error) {
        console.error('Error al leer o procesar el archivo:', error);
        return res.json({ success: false, message: 'Error al procesar la solicitud' });
    }
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