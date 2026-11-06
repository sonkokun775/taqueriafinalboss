// 1. Conectar con los elementos del HTML
const botonesAgregar = document.querySelectorAll('.btn-agregar');
const listaCarrito = document.getElementById('lista-carrito');
const totalPantalla = document.getElementById('total');
const botonPagar = document.getElementById('btn-pagar'); 

// 📋 NUEVO: Conectar con los campos del formulario de entrega
const inputNombre = document.getElementById('nombre-cliente');
const inputDireccion = document.getElementById('direccion-cliente');
const inputPago = document.getElementById('pago-cliente');

let totalAcumulado = 0;
let productosEnCarrito = []; // Estructura interna: [{nombre: 'Burrito', precio: 100, cantidad: 1}]

// 2. Lógica para ir sumando productos al pedido agrupándolos de forma inteligente
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', (e) => {
        const nombre = e.target.getAttribute('data-nombre');
        const precio = parseInt(e.target.getAttribute('data-precio'));

        totalAcumulado += precio;
        totalPantalla.innerText = totalAcumulado;

        // Verificar si el producto ya existe en el carrito
        const productoExistente = productosEnCarrito.find(prod => prod.nombre === nombre);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            productosEnCarrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
        }

        // Renderizar la lista visual en la caja neón
        actualizarCarritoVisual();
    });
});

function actualizarCarritoVisual() {
    listaCarrito.innerHTML = '';
    
    productosEnCarrito.forEach((prod, index) => {
        const nuevoItem = document.createElement('li');
        nuevoItem.style.display = 'flex';
        nuevoItem.style.justifyContent = 'space-between';
        nuevoItem.style.alignItems = 'center';
        nuevoItem.style.marginBottom = '10px';

        // Texto del producto
        const textoProd = document.createElement('span');
        textoProd.innerText = `• ${prod.cantidad}x ${prod.nombre} - $${prod.precio * prod.cantidad} MXN`;
        
        // Botón de restar pequeño
        const btnRestar = document.createElement('button');
        btnRestar.innerText = '−';
        btnRestar.className = 'btn-restar';
        btnRestar.style.padding = '2px 8px';
        btnRestar.style.fontSize = '12px';
        btnRestar.style.marginLeft = '10px';
        btnRestar.style.backgroundColor = '#e63946'; // Rojo para indicar restar
        btnRestar.style.color = '#fff';
        btnRestar.style.width = 'auto'; // Evita que se haga del 100% en celulares

        // Lógica para restar cantidad o eliminar si llega a 0
        btnRestar.addEventListener('click', () => {
            totalAcumulado -= prod.precio;
            totalPantalla.innerText = totalAcumulado;

            if (prod.cantidad > 1) {
                prod.cantidad -= 1;
            } else {
                productosEnCarrito.splice(index, 1); // Lo borra por completo del arreglo
            }
            
            actualizarCarritoVisual(); // Refresca la pantalla
        });

        nuevoItem.appendChild(textoProd);
        nuevoItem.appendChild(btnRestar);
        listaCarrito.appendChild(nuevoItem);
    });
}

// 3. 📲 ENVÍO AUTOMATIZADO DE TICKET POR WHATSAPP
botonPagar.addEventListener('click', () => {
    // Validación de carrito vacío
    if (productosEnCarrito.length === 0) {
        alert("¡Tu carrito está vacío, agrega unos buenos tacos primero! 🌮");
        return;
    }

    // 📋 VALIDACIÓN DE DATOS: Obligamos a llenar Nombre y Dirección antes de ir a WhatsApp
    const nombre = inputNombre.value.trim();
    const direccion = inputDireccion.value.trim();
    const pagoCon = inputPago.value.trim() || "Exacto / No especificado";

    if (!nombre || !direccion) {
        alert("🚨 Por favor, escribe tu Nombre y Dirección completa para poder enviar el pedido.");
        return;
    }

    // 📞 CONFIGURACIÓN DEL TELÉFONO (Código de país 52 para México + 10 dígitos)
    // Nota: Reemplaza las X con el número real de la taquería. No uses diagonales '/' después de wa.me
    const numeroDueño = "528132402722"; 

    // Armamos el ticket final súper limpio y estructurado
    let mensajeWhatsApp = `🔥 *¡NUEVO PEDIDO DESDE LA PÁGINA WEB!* 🔥\n\n`;
    
    mensajeWhatsApp += `*📋 DETALLE DEL PEDIDO:*\n`;
    productosEnCarrito.forEach(prod => {
        mensajeWhatsApp += `• *${prod.cantidad}x* ${prod.nombre} - _$${prod.precio * prod.cantidad} MXN_\n`;
    });

    mensajeWhatsApp += `\n🛵 *DATOS DE ENTREGA:*\n`;
    mensajeWhatsApp += `• *Cliente:* ${nombre}\n`;
    mensajeWhatsApp += `• *Dirección:* ${direccion}\n`;
    mensajeWhatsApp += `• *Método de pago:* Efectivo (${pagoCon})\n\n`;
    
    mensajeWhatsApp += `💰 *TOTAL A PAGAR:* *$${totalAcumulado} MXN*`;

    // Codificamos la URL oficial sin errores de sintaxis
    const urlWhatsApp = `https://wa.me/528132402722?text=${encodeURIComponent(mensajeWhatsApp)}`;
    
    // Abre WhatsApp con el mensaje listo para disparar
    window.open(urlWhatsApp, '_blank');

    // 🧹 Limpieza automática y segura del carrito tras enviar
    listaCarrito.innerHTML = '';
    totalAcumulado = 0;
    totalPantalla.innerText = '0';
    productosEnCarrito = []; // Corregido: vuelve a ser un arreglo limpio, no un 0.
    
    // Limpiamos los inputs de texto
    inputNombre.value = '';
    inputDireccion.value = '';
    inputPago.value = '';
});
