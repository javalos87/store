// Cuando se cargue la pagina principal cargar los productos
document.addEventListener("DOMContentLoaded", cargarProductos);

const numerito = document.querySelector("#numerito");
const inputBuscar = document.querySelector("#buscar");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");

let botonesAgregar = document.querySelectorAll(".producto-agregar");
let array_productos = [];
let productosEnCarrito;
const contenedorProductos = document.querySelector("#contenedor-productos");

let productosEnCarritoLS = recuperar("productos-en-carrito");

// Almacenar("Productos",productos)
function almacenar(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// Recuperar objeto
function recuperar(key) {
  let recuperado = JSON.parse(localStorage.getItem(key));
  if (recuperado === null) {
    return (recuperado = []);
  } else {
    return recuperado;
  }
}
// Agregar Objeto
function agregar(key, new_element) {
  let dato = recuperar(key);
  dato.push(new_element);
  almacenar(key, dato);
}

// Verificar si carrito existe en LS
if (productosEnCarritoLS) {
  productosEnCarrito = productosEnCarritoLS;
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}

async function cargarProductos() {
  const url = "https://fakestoreapi.com/products";
  try {
    const resultado = await fetch(url);
    const productos = await resultado.json();
    array_productos = productos;
    mostrarProductos(productos);
  } catch (error) {
    console.log(error);
  }
}

function mostrarProductos(productos) {
  console.log(productos);
  /* debugger; */
  contenedorProductos.innerHTML = "";

  productos.forEach((prod) => {
    const { id, title, price, category, description, image } = prod;
    const div = document.createElement("div");
    div.classList.add("producto");
    div.classList.add("col");
    div.innerHTML = `

          <img class="producto-imagen" src="${image}" alt="${title}">
          <div class="producto-detalles">
              <h3 class="producto-nombre ">${title}</h3>
              <p class="producto-precio">$${price}</p>
              <button class="producto-agregar" id="${id}">Agregar</button>
          </div>
      `;
    contenedorProductos.append(div);
  });
  actualizarBotonesAgregar();
}

function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");
  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

function agregarAlCarrito(e) {
  Toastify({
    text: "Producto agregado",
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
  const productoAgregado = array_productos.find(
    (producto) => producto.id === parseInt(idBoton)
  );

  if (
    productosEnCarrito.some((producto) => producto.id === parseInt(idBoton))
  ) {
    const index = productosEnCarrito.findIndex(
      (producto) => producto.id === parseInt(idBoton)
    );

    productosEnCarrito[index].cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  actualizarNumerito();

  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );

  console.log(e.currentTarget.id);
  console.log(array_productos);
}

function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numerito.innerText = nuevoNumerito;
}

function filtrarProductos() {
  debugger;
  let productoBuscado = array_productos.filter((producto) =>
    producto.title
      .toLowerCase()
      .includes(inputBuscar.value.toLowerCase().trim())
  );
  productoBuscado !== [] && mostrarProductos(productoBuscado);
}
// Buscador letra por letra
inputBuscar.addEventListener("keyup", filtrarProductos);

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");
    console.log(array_productos);
    /* debugger; */
    if (e.currentTarget.id === "mens") {
      e.currentTarget.id = "men's clothing";
    }
    if (e.currentTarget.id === "womens") {
      e.currentTarget.id = "women's clothing";
    }

    if (e.currentTarget.id != "todos") {
      const productoCategoria = array_productos.find(
        (producto) => producto.category === e.currentTarget.id
      );

      tituloPrincipal.innerText = productoCategoria.category.toUpperCase();
      const productosBoton = array_productos.filter(
        (producto) => producto.category === e.currentTarget.id
      );
      mostrarProductos(productosBoton);
    } else {
      tituloPrincipal.innerText = "TODOS LOS PRODUCTOS";
      mostrarProductos(array_productos);
    }
  });
});
