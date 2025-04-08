# CRUD-API-REST

## 🧪 Práctico: Consumo de API REST – POST, PUT y DELETE

### 🎯 Objetivo

Utilizar la API pública [https://restful-api.dev](https://restful-api.dev) para **crear, editar y eliminar un objeto**.  
Como la API **no devuelve una lista personalizada de objetos creados**, usaremos `localStorage` para guardar el `ID` del objeto y poder trabajar con él.

---

## ✅ Parte 1: Crear un nuevo objeto (`POST`)

1. Creá un formulario en React que tenga los siguientes campos obligatorios:
   - `name` (nombre del objeto)
   - `features` (características, como array o string simple)
   - `price` (número)
   - `year` (año de fabricación)

2. Al enviar el formulario:
   - Realizá una petición `POST` a `https://api.restful-api.dev/objects`
   - Mostrá en consola o en pantalla la respuesta
   - Guardá el objeto completo (o al menos su `id`) en el `localStorage`

### 📌 Ejemplo de cuerpo a enviar:

```json
{
  "name": "Teclado mecánico",
  "data": {
    "features": "retroiluminado, switch rojo",
    "price": 250,
    "year": 2022
  }
}

```

## ✅ Parte 2: Editar el objeto (`PUT`)

1. Obtené el `id` guardado en el `localStorage`.
2. Permití modificar alguno de los campos (por ejemplo, `features` o `price`).
3. Realizá una petición `PUT` a `https://api.restful-api.dev/objects/:id` con los datos actualizados.
4. Mostrá la respuesta por consola o en pantalla.

---

## ✅ Parte 3: Eliminar el objeto (`DELETE`)

1. Usá el `id` guardado en el `localStorage`.
2. Realizá una petición `DELETE` a `https://api.restful-api.dev/objects/:id`.
3. Mostrá un mensaje de éxito si se elimina correctamente y borrá el `ID` del `localStorage`.


## 🧠 Consideraciones

- Usá `fetch()` para todas las operaciones.
- Manejá estados con `useState` y efectos con `useEffect` si lo necesitás.
- Podés usar `localStorage.getItem()` y `localStorage.setItem()` para guardar y recuperar el `id`.
- No hace falta listar objetos de la API, ya que no son filtrables por usuario.
