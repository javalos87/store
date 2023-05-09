let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

let array_productos = [];

async function cargarProductos() {
  const url = "https://fakestoreapi.com/products";
  try {
    const resultado = await fetch(url);
    const productos = await resultado.json();
    array_productos = productos;
  } catch (error) {
    console.log(error);
  }
}

function cargarProductosCarrito() {
  cargarProductos();
  actualizarNumerito();
  if (productosEnCarrito && productosEnCarrito.length > 0) {
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoComprado.classList.add("disabled");

    contenedorCarritoProductos.innerHTML = "";

    productosEnCarrito.forEach((array_productos) => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
                <img class="carrito-producto-imagen " src="${
                  array_productos.image
                }" alt="${array_productos.title}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${array_productos.title}</h3>
                </div>
                <div class="carrito-producto-cantidad text-center">
                    <small>Cantidad</small>
                    <p>${array_productos.cantidad}</p>
                </div>
                <div class="carrito-producto-precio text-center">
                    <small>Precio</small>
                    <p>$${array_productos.price}</p>
                </div>
                <div class="carrito-producto-subtotal text-center">
                    <small>Subtotal</small>
                    <p>$${array_productos.price * array_productos.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${
                  array_productos.id
                }"><i class="bi bi-trash-fill"></i></button>
            `;

      contenedorCarritoProductos.append(div);
    });

    actualizarBotonesEliminar();
    actualizarTotal();
  } else {
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
  }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
  botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
  });
}

function eliminarDelCarrito(e) {
  Toastify({
    text: "Producto eliminado",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #4b33a8, #785ce9)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
    },
    offset: {
      x: "1.5rem",
      y: "1.5rem",
    },
    onClick: function () {},
  }).showToast();

  const idBoton = e.currentTarget.id;
  const index = productosEnCarrito.findIndex(
    (producto) => producto.id === idBoton
  );

  productosEnCarrito.splice(index, 1);
  cargarProductosCarrito();

  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
  Swal.fire({
    title: "¿Estás seguro?",
    icon: "question",
    html: `Se van a borrar ${productosEnCarrito.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    )} productos.`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      productosEnCarrito.length = 0;
      localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
      );

      cargarProductosCarrito();
    }
  });
}

function actualizarTotal() {
  const totalCalculado = productosEnCarrito.reduce(
    (acc, array_productos) =>
      acc + array_productos.price * array_productos.cantidad,
    0
  );
  total.innerText = `$${totalCalculado.toFixed(2)}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
  agregar("Historial_Ventas", productosEnCarrito);
  productosEnCarrito.length = 0;
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
  actualizarNumerito();
  contenedorCarritoVacio.classList.add("disabled");
  contenedorCarritoProductos.classList.add("disabled");
  contenedorCarritoAcciones.classList.add("disabled");
  contenedorCarritoComprado.classList.remove("disabled");
}

function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numerito.innerText = nuevoNumerito;
}
