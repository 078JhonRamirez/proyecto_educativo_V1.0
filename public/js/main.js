const btnReset = document.getElementById("reset");
btnReset.addEventListener("click", () => {
    limpiarErrores();
});


function procesarDatos(datos) {
    return {
        ...datos,
        fechaRegistro: new Date(),
        nombreCompleto: datos.nombre.toUpperCase()
    }
}


function mostrarError(elementId, mensaje) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = mensaje;
    errorElement.classList.add('visible');
}

function limpiarErrores() {
    const errores = document.querySelectorAll('.error');
    errores.forEach(error => {
        error.textContent = '';
        error.classList.remove('visible');
    });
}


function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarNombre(nombre) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(nombre);
}

function validarPassword(password) {
    return password.length >= 8 
    // &&
    //     /[A-Z]/.test(password) &&
    //     /[0-9]/.test(password);
};

const validarFormulario = (formData) => {
    let esValido = true;
    let email = formData.get("email");
    let nombre = formData.get("nombre");
    let password = formData.get("password");
    limpiarErrores();
    console.log(email, nombre, password);

    if (!validarNombre(nombre)) {
        mostrarError('nombreError', 'Debe ser un nombre valido');
        esValido = false;
    }
    if (!validarEmail(email)) {
        mostrarError('emailError', 'Debe ser un correo valido');
        esValido = false;
    }
    if (!validarPassword(password)) {
        mostrarError('passwordError', 'la contraseña debe ser mayor a 8 caracteres');
        esValido = false;
    }
    return esValido;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let formData = new FormData(form);

        if (validarFormulario(formData)) {
            enviarFormulario(formData)
        }

    });

});



async function enviarFormulario(formData) {
    try {
        const formObject = Object.fromEntries(formData);
        const response = await fetch('/index', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject)
        });

        const data = await response.json();

        if (data.success) {
            alert("Usuario registrado exitosamente")
        } else {
            alert("Error al registrar usuario:", data.message || "Error desconocido");
        }
    } catch (error) {
        alert("Error al procesar el registro", error);
    }
}


