// 1. Conectar con los elementos del HTML
const botonesAgregar = document.querySelectorAll('.btn-agregar');
const listaCarrito = document.getElementById('lista-carrito');
const totalPantalla = document.getElementById('total');
const botonPagar = document.getElementById('btn-pagar'); 

let totalAcumulado = 0;
let productosEnCarrito = []; 

// 2. Lógica para ir sumando productos al pedido
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', (e) => {
        const nombre = e.target.getAttribute('data-nombre');
        const precio = parseInt(e.target.getAttribute('data-precio'));

        totalAcumulado += precio;
        totalPantalla.innerText = totalAcumulado;
        productosEnCarrito.push(nombre);

        const nuevoItem = document.createElement('li');
        nuevoItem.innerText = `${nombre} - $${precio} MXN`;
        listaCarrito.appendChild(nuevoItem);
    });
});

// 3. 📲 TU NUEVO BOTÓN: Envía el ticket directamente al WhatsApp del dueño
botonPagar.innerText = "Enviar pedido por WhatsApp"; // Cambiamos el texto del botón dinámicamente

botonPagar.addEventListener('click', () => {
    if (totalAcumulado === 0) {
        alert("¡Tu carrito está vacío, agrega unos buenos tacos primero!");
        return;
    }

    // 📞 CONFIGURACIÓN DEL DUEÑO (Aquí pones el celular real del cliente cuando te compre)
    const numeroDueño = "528132402722"; // Prefijo de México (52) + 10 dígitos del cliente

    // Armamos el ticket de texto limpio que le va a llegar al dueño
    let mensajeWhatsApp = `🚨 *¡NUEVO PEDIDO DESDE LA PÁGINA WEB!* 🚨\n\n`;
    mensajeWhatsApp += `*Detalle del pedido:*\n`;
    productosEnCarrito.forEach(prod => {
        mensajeWhatsApp += `- ${prod}\n`;
    });
    mensajeWhatsApp += `\n💰 *Total a Pagar:* $${totalAcumulado} MXN\n\n`;
    mensajeWhatsApp += `_(Por favor, escribe abajo tu Nombre, Dirección de entrega y método de pago antes de enviar este mensaje)_`;

    // Codificamos la URL oficial para que WhatsApp la lea con espacios y emojis
    const urlWhatsApp = `https://wa.me/528132402722?text=${encodeURIComponent(mensajeWhatsApp)}`;
    
    // Abre el WhatsApp en una pestaña nueva
    window.open(urlWhatsApp, '_blank');

    // 🧹 Limpieza automática del carrito en tu pantalla neón
    listaCarrito.innerHTML = '';
    totalAcumulado = 0;
    totalPantalla.innerText = '0';
    productosEnCarrito =0;
});
