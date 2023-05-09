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
