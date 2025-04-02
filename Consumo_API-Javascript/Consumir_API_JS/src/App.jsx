import { useState, useEffect } from "react";

function ChuckNorrisJokes() {
  const [jokes, setJokes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const response = await fetch("https://api.chucknorris.io/jokes/random");
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await response.json();
        setJokes([data]); // Guardamos el chiste en un array para la tabla
      } catch (error) {
        console.error("Error al obtener el chiste:", error);
        setError(error.message);
      }
    };
    
    fetchJokes();
  }, []);

  return (
    <div>
      <h2>Chistes de Chuck Norris</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Categoría</th>
            <th>Chiste</th>
          </tr>
        </thead>
        <tbody>
          {jokes.map((joke) => (
            <tr key={joke.id}>
              <td>{joke.id}</td>
              <td>{joke.categories.length > 0 ? joke.categories.join(", ") : "Sin categoría"}</td>
              <td>{joke.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChuckNorrisJokes;
