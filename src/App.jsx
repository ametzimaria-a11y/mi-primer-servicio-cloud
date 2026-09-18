import { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [estadoServicio, setEstadoServicio] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en el servidor");
        }
        return response.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setCargando(false);
      });

    fetch("http://localhost:3000/api/estado")
      .then((response) => response.json())
      .then((data) => setEstadoServicio(data))
      .catch((error) => {
        console.error(error);
        setEstadoServicio(null);
      });
  }, []);

  const categorias = ["Todas", ...new Set(productos.map((p) => p.categoria))];

  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === "Todas" ||
      producto.categoria === categoriaSeleccionada;

    return coincideNombre && coincideCategoria;
  });

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Mi Primer Servicio Cloud</h1>
      <p>Aplicación React consumiendo una API desarrollada con Node.js</p>

      <div style={{ marginTop: "10px", marginBottom: "20px" }}>
        {estadoServicio ? (
          <span style={{ color: "green" }}>
            🟢 {estadoServicio.servicio} Online — {estadoServicio.servidor} (v
            {estadoServicio.version})
          </span>
        ) : (
          <span style={{ color: "red" }}>🔴 Servicio no disponible</span>
        )}
      </div>

      <div style={{ marginTop: "20px", marginBottom: "10px" }}>
        <label>Buscar producto: </label>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Escribe un nombre..."
          style={{ padding: "6px 10px", marginLeft: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Categoría: </label>
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          style={{ padding: "6px 10px", marginLeft: "8px" }}
        >
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>

      {cargando && <p>Cargando información...</p>}
      {error && <p>No fue posible conectar con el servicio.</p>}

      {!cargando && !error &&
        productosFiltrados.map((producto) => (
          <div
            key={producto.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginTop: "10px",
              borderRadius: "8px"
            }}
          >
            <h3>{producto.nombre}</h3>
            <p>Precio: ${producto.precio}</p>
            <p>Categoría: {producto.categoria}</p>
          </div>
        ))}
    </div>
  );
}

export default App;