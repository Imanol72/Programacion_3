import { useState, useEffect } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("productos");
    if (data) {
      setProducts(JSON.parse(data));
    } else {
      const initialProducts = [
        { id: 1, name: "Monitor", price: 250, stock: 10 },
        { id: 2, name: "Teclado", price: 50, stock: 25 },
        { id: 3, name: "Mouse", price: 30, stock: 40 }
      ];
      setProducts(initialProducts);
      localStorage.setItem("productos", JSON.stringify(initialProducts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(products));
  }, [products]);

  const addProduct = () => {
    if (!name || !price || !stock) return;
    
    if (editing !== null) {
      const newProducts = products.map((p) =>
        p.id === editing ? { id: editing, name, price: Number(price), stock: Number(stock) } : p
      );
      setProducts(newProducts);
      setEditing(null);
    } else {
      const newProduct = {
        id: Date.now(),
        name,
        price: Number(price),
        stock: Number(stock)
      };
      setProduct([...products, newProduct]);
    }
    setName("");
    setPrice("");
    setStock("");
  };

  const editingProduct = (product) => {
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setEditing(product.id);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const deleteAll = () => {
    setProducts([]);
    localStorage.removeItem("productos");
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventario de Productos</h1>
      <div className="mb-4">
        <input className="border p-2 mr-2" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 mr-2" placeholder="Precio" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="border p-2 mr-2" placeholder="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
        <button className="bg-blue-500 text-white p-2" onClick={addProduct}>{editing ? "Actualizar" : "Agregar"}</button>
      </div>
      <ul className="space-y-2">
        {products.map((product) => (
          <li key={product.id} className="flex justify-between border p-2">
            <span>{product.name} - ${product.setPrice} - Stock: {product.stock}</span>
            <div>
              <button className="bg-yellow-500 text-white p-1 mr-2" onClick={() => editingProduct(product)}>Editar</button>
              <button className="bg-red-500 text-white p-1" onClick={() => deleteAll(product.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
      {products.length > 0 && <button className="bg-red-700 text-white p-2 mt-4" onClick={deleteAll}>Eliminar Todos</button>}
    </div>
  );
}
