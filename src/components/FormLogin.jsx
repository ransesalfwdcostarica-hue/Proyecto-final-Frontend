import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../Services/userService";

function FormLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const user = await loginUser(formData.email, formData.password);
      
      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      
      navigate("/home");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="glass-card">
      <h2 className="title">Iniciar Sesión</h2>

      <form onSubmit={handleLogin}>
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

        {error && <p className="error-text">{error}</p>}

        <button 
          className="form-button" 
          type="submit" 
          disabled={loading}
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
        <p>¿No tienes cuenta? <Link to="/registro" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Regístrate aquí</Link></p>
      </div>
    </div>
  );
}

export default FormLogin;
