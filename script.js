// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los botones de añadir al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    // Seleccionar el contenedor donde se mostrarán los ítems del carrito
    const cartItemsContainer = document.getElementById('cart-items');
    // Seleccionar el elemento donde se mostrará el total del carrito
    const cartTotalElement = document.getElementById('cart-total');
    // Seleccionar el elemento donde se mostrará el contador de artículos en el carrito
    const cartItemCountElement = document.getElementById('cart-item-count');
    // Seleccionar el div para el resumen del pedido en el checkout
    const orderSummaryContainer = document.getElementById('order-summary');

    // Array para almacenar los productos en el carrito
    // Este carrito es temporal y se reinicia cada vez que recargas la página.
    let cart = [];

    // Monto inicial para la cotización (cambiado a 0 si no lo quieres por defecto)
    const initialQuotationAmount = 0.00; // Cambia a 0.00 si no quieres un monto base

    // **** NUEVA FUNCIÓN: Para formatear números con comas y 2 decimales ****
    function formatNumberWithCommas(value) {
        // Convierte el valor a un número fijo con 2 decimales y luego inserta comas cada 3 dígitos
        return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Función para actualizar la visualización del carrito en la página
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Limpiar el contenido actual del carrito
        let totalItemsPrice = 0; // Inicializar el total de solo los ítems

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item-display');
                // Aquí usamos template literals para organizar mejor la información
                cartItemDiv.innerHTML = `
                    <div class="cart-item-info">
                        <span>${item.name}</span>
                        <span>$${formatNumberWithCommas(item.price)}</span>
                    </div>
                    <button class="remove-from-cart" data-index="${index}">X</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
                totalItemsPrice += item.price; // Sumar el precio del ítem al total de los ítems
            });
        }
        
        const finalQuotationTotal = totalItemsPrice + initialQuotationAmount;

        // Actualizar el texto del total en la interfaz del carrito, usando la nueva función de formato
        cartTotalElement.textContent = `$${formatNumberWithCommas(finalQuotationTotal)}`;
        
        cartItemCountElement.textContent = cart.length;

        // Actualizar la sección de "Revisión del Pedido / Artículos a Cotizar"
        updateOrderSummaryDisplay(totalItemsPrice, finalQuotationTotal);
    }

    // Función para actualizar el resumen en la sección de checkout
    function updateOrderSummaryDisplay(itemsTotal, finalTotal) {
        orderSummaryContainer.innerHTML = ''; 

        if (cart.length === 0) {
            orderSummaryContainer.innerHTML = '<p>No hay artículos en el carrito para cotizar.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.classList.add('order-summary-list');
        cart.forEach(item => {
            const li = document.createElement('li');
            // Formatear el precio individual aquí también
            li.innerHTML = `<span>${item.name}</span><span>$${formatNumberWithCommas(item.price)}</span>`;
            ul.appendChild(li);
        });
        orderSummaryContainer.appendChild(ul);

        const totalsDiv = document.createElement('div');
        totalsDiv.classList.add('order-summary-totals');
        totalsDiv.innerHTML = `
            <p>Subtotal de Artículos: <span>$${formatNumberWithCommas(itemsTotal)}</span></p>
            <p>Monto Inicial de Cotización: <span>$${formatNumberWithCommas(initialQuotationAmount)}</span></p>
            <p class="final-quotation-total">Total de Cotización: <span>$${formatNumberWithCommas(finalTotal)}</span></p>
        `;
        orderSummaryContainer.appendChild(totalsDiv);
    }

    // Añadir un "escuchador de eventos" a cada botón "Añadir al Carrito"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productItem = event.target.closest('.product-item');
            if (productItem) {
                const productName = productItem.querySelector('h3').textContent;
                const productPriceText = productItem.querySelector('p').textContent;
                // Elimina el símbolo '$' y todas las comas antes de convertir a número
                const productPrice = parseFloat(productPriceText.replace('$', '').replace(/,/g, ''));

                if (isNaN(productPrice)) { // Añadida verificación para NaN
                    console.error('Error al parsear el precio del producto:', productName, productPriceText);
                    alert('Hubo un problema al añadir el producto. Por favor, intente de nuevo.');
                    return; // Detener la ejecución si el precio no es válido
                }

                const product = {
                    name: productName,
                    price: productPrice
                };

                cart.push(product); // Añadir el producto al array del carrito
                updateCartDisplay(); // Actualizar la interfaz del carrito para mostrar el nuevo ítem
                alert(`"${productName}" ha sido añadido al carrito.`);
            }
        });
    });

    // Añadir un "escuchador de eventos" al contenedor del carrito para manejar la eliminación de ítems
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart')) {
            const indexToRemove = parseInt(event.target.dataset.index);

            if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < cart.length) {
                cart.splice(indexToRemove, 1);
                updateCartDisplay();
            }
        }
    });

    // Función para el botón "Continuar al Pago / Solicitar Cotización"
    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Tu carrito está vacío. Por favor, añade algunos productos antes de continuar.');
            } else {
                alert('Redirigiendo al proceso de pago o solicitud de cotización...');
                document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Lógica del Carrusel (Slider) para Novedades
    const carouselTrack = document.getElementById('highlight-carousel-track');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    let currentIndex = 0;
    let itemsPerView = 3; // Por defecto para escritorio
    let autoSlideInterval; // Variable para almacenar el ID del intervalo de auto-slide

    // Función para obtener el número de ítems visibles basado en el tamaño de pantalla
    function getItemsPerView() {
        if (window.innerWidth <= 768) { // Móviles
            return 1;
        } else if (window.innerWidth <= 1024) { // Tabletas
            return 2;
        } else { // Escritorio
            return 3;
        }
    }

    // Función para actualizar la posición del carrusel
    function updateCarousel() {
        itemsPerView = getItemsPerView(); // Actualizar ítems por vista al cambiar el tamaño
        // Asegúrate de que carouselItems[0] existe antes de intentar acceder a offsetWidth
        if (carouselItems.length === 0) return;

        const itemWidth = carouselItems[0].offsetWidth; // Ancho de un solo ítem
        carouselTrack.style.transform = `translateX(${-currentIndex * itemWidth}px)`;

        updateIndicators();
    }

    // Función para crear y actualizar los indicadores de puntos
    function createIndicators() {
        indicatorsContainer.innerHTML = ''; // Limpiar indicadores existentes
        // Calcular el número total de "diapositivas" (grupos de ítems)
        const totalSlides = Math.ceil(carouselItems.length / itemsPerView);
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('carousel-indicator-dot');
            dot.dataset.index = i; // Guardar el índice de la diapositiva
            dot.addEventListener('click', () => {
                // Al hacer clic en un indicador, ir al inicio de ese grupo de ítems
                currentIndex = i * itemsPerView;
                updateCarousel();
                resetAutoSlide(); // Reiniciar el auto-slide al interactuar manualmente
            });
            indicatorsContainer.appendChild(dot);
        }
        updateIndicators(); // Asegurar que el indicador inicial esté activo
    }

    // Función para actualizar el estado activo de los indicadores
    function updateIndicators() {
        const dots = document.querySelectorAll('.carousel-indicator-dot');
        dots.forEach((dot, i) => {
            // Calcular la diapositiva activa basándose en el currentIndex
            const activeSlideIndex = Math.floor(currentIndex / itemsPerView);
            if (i === activeSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Función para avanzar el carrusel automáticamente
    function autoSlide() {
        itemsPerView = getItemsPerView();
        // Asegúrate de que no intentamos avanzar más allá del último ítem
        if (currentIndex + itemsPerView < carouselItems.length) {
            currentIndex += itemsPerView;
        } else {
            // Si estamos al final, volvemos al principio
            currentIndex = 0;
        }
        updateCarousel();
    }

    // Función para iniciar el auto-slide
    function startAutoSlide() {
        // Establece el intervalo para mover el carrusel cada 5 segundos (5000ms)
        // Solo inicia si autoSlideInterval no está ya definido para evitar múltiples intervalos
        if (!autoSlideInterval) {
            autoSlideInterval = setInterval(autoSlide, 3000);
        }
    }

    // Función para reiniciar el auto-slide (útil después de una interacción manual o resize)
    function resetAutoSlide() {
        clearInterval(autoSlideInterval); // Limpiar el intervalo existente
        autoSlideInterval = null; // Resetear la variable del intervalo
        startAutoSlide(); // Iniciar uno nuevo
    }

    // Evento para el botón "Siguiente"
    nextButton.addEventListener('click', () => {
        itemsPerView = getItemsPerView();
        // Asegúrate de que no intentamos avanzar más allá del último ítem
        if (currentIndex + itemsPerView < carouselItems.length) {
            currentIndex += itemsPerView;
        } else {
            // Si estamos al final, volvemos al principio
            currentIndex = 0;
        }
        updateCarousel();
        resetAutoSlide(); // Reiniciar el auto-slide al interactuar manualmente
    });

    // Evento para el botón "Anterior"
    prevButton.addEventListener('click', () => {
        itemsPerView = getItemsPerView();
        // Asegúrate de que no intentamos retroceder más allá del primer ítem
        if (currentIndex - itemsPerView >= 0) {
            currentIndex -= itemsPerView;
        } else {
            // Si estamos al principio, vamos al último grupo de ítems
            // Calcula el índice de inicio del último grupo
            const totalSlides = Math.ceil(carouselItems.length / itemsPerView);
            let lastGroupStartIndex = (totalSlides - 1) * itemsPerView;
            // Asegurarse de que el índice no excede el tamaño real del array de ítems
            if (lastGroupStartIndex >= carouselItems.length) {
                lastGroupStartIndex = Math.max(0, carouselItems.length - itemsPerView);
            }
            currentIndex = lastGroupStartIndex;
        }
        updateCarousel();
        resetAutoSlide(); // Reiniciar el auto-slide al interactuar manualmente
    });

    // Ajustar el carrusel al cargar la página y al redimensionar la ventana
    window.addEventListener('resize', () => {
        // Retrasar la actualización para evitar problemas de rendimiento durante el redimensionamiento
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            updateCarousel();
            createIndicators(); // Recrear indicadores si los ítems por vista cambian
            resetAutoSlide(); // Reiniciar auto-slide para asegurar el buen funcionamiento con el nuevo tamaño
        }, 250);
    });

    // Inicializar el carrito cuando se carga la página
    updateCartDisplay();

    // Inicializar el carrusel cuando se carga la página
    // Asegúrate de que los elementos del carrusel existan antes de inicializar
    if (carouselTrack && carouselItems.length > 0) {
        createIndicators(); // Crear los puntos de navegación
        updateCarousel(); // Posicionar el carrusel correctamente al inicio
        startAutoSlide(); // Iniciar el auto-slide
    }
});