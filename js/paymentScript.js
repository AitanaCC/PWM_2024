// Formato automático para el número de tarjeta con límite de 16 dígitos y espacios automáticos
document.getElementById('cardNumber').addEventListener('input', function(e) {
    // Eliminar todo lo que no sea dígitos
    var value = e.target.value.replace(/\D/g, '');
    // Cortar a 16 dígitos máximo
    value = value.slice(0, 16);
    // Añadir espacios cada 4 dígitos
    var finalValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            finalValue += ' '; // Añadir espacio
        }
        finalValue += value[i];
    }
    e.target.value = finalValue;
});

// Formato automático para la fecha de caducidad
document.getElementById('expiryDate').addEventListener('input', function(e) {
    var input = e.target.value;
    var oldVal = e.target.getAttribute('data-old-value') || '';

    // Asegurar solo dígitos y longitud máxima
    input = input.replace(/\D/g, '').slice(0, 4);

    // Agregar barra si la longitud es adecuada y el usuario no está borrando
    if (input.length >= 2) {
        // Comprobar si el usuario está intentando borrar la barra
        if(oldVal.length > input.length && oldVal[oldVal.length - 1] === '/') {
            input = input.slice(0, 1); // Permitir borrar la barra
        } else {
            input = input.slice(0, 2) + '/' + input.slice(2, 4);
        }
    }

    // Actualizar el valor del campo
    e.target.value = input;

    // Almacenar el valor actual para la próxima comparación
    e.target.setAttribute('data-old-value', input);
});


document.querySelector('form').addEventListener('submit', function(e) {
    const expiryInput = document.getElementById('expiryDate');
    const expiryValue = expiryInput.value;
    const [month, year] = expiryValue.split('/').map(num => parseInt(num, 10));
    const currentYear = new Date().getFullYear() % 100; // Obtener los últimos dos dígitos del año actual
    const currentMonth = new Date().getMonth() + 1; // getMonth() devuelve un índice basado en cero, por lo que sumamos 1

    // Comprobar si el mes es mayor que 12 o menor que 1
    if (month > 12 || month < 1) {
        alert('El mes ingresado no es válido. Por favor, ingrese un mes válido (entre 1 y 12).');
        e.preventDefault(); // Detener el envío del formulario
        return;
    }

    // Comprobar si la fecha de caducidad es anterior a la fecha actual
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        alert('Fecha de caducidad de la tarjeta no es válida. Por favor, compruebe nuevamente.');
        e.preventDefault(); // Detener el envío del formulario
    }
});


// Validación del número de tarjeta con el algoritmo de Luhn
function isValidCardNumber(number) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i), 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return (sum % 10) == 0;
}

// Validación del CVV para que solo permita 3 dígitos
document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Validación al enviar el formulario
document.querySelector('form').addEventListener('submit', function(e) {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    if (!isValidCardNumber(cardNumber)) {
        alert('El número de tarjeta no es válido. Por favor, compruebe nuevamente.');
        e.preventDefault(); // Detener la presentación del formulario
    }
});