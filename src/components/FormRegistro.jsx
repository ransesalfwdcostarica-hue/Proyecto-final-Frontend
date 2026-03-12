import { useState } from "react";
import { registerUser } from "../Services/userService";

function FormRegistro() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    edad: "",
    rol: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    // Simple validacion
    if (!formData.email || !formData.password || !formData.nombre || !formData.edad || !formData.rol) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData);
      alert("¡Usuario registrado con éxito!");
      setFormData({ email: "", password: "", nombre: "", edad: "", rol: "" });
    } catch (err) {
      setError("Hubo un error al registrar el usuario. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h2 className="title">Registro</h2>

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <input
            name="email"
            className="form-input"
            type="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            name="password"
            className="form-input"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            name="nombre"
            className="form-input"
            type="text"
            placeholder="Nombre Completo"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            name="edad"
            className="form-input"
            type="number"
            placeholder="Edad"
            value={formData.edad}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <select 
            className="form-select" 
            name="rol" 
            value={formData.rol} 
            onChange={handleChange}
          >
            <option value="" disabled>Selecciona un rol</option>
            <option value="admin">Administrador</option>
            <option value="client">Cliente</option>
          </select>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button 
          className="form-button" 
          type="submit" 
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}

export default FormRegistro;

