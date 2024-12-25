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
    const regex = /^[A-Za-z]+$/;
    return regex.test(nombre);
}

function validarPassword(password) {
    return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password);
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let formData = new FormData(form);
        validarFormulario(formData);
    });

});


const validarFormulario = (formData) => {
    let esValido = true;
    let email = formData.get("email");
    let nombre = formData.get("nombre");
    let password = formData.get("password");
    console.log(email, nombre, password);
    

    if (!validarNombre(nombre)) {
        mostrarError('nombre', 'Debe ser un nombre valido');
        esValido = false;
    }
    if (!validarEmail(email)) {
        mostrarError('emailError', 'Debe ser un correo valido');
        esValido = false;
    }
    if (!validarPassword(password)) {
        mostrarError('password', 'la contraseña debe ser mayor a 8 caracteres');
        esValido = false;
    }
    return esValido;

}