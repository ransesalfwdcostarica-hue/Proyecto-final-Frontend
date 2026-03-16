import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
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

      alert(`¡Bienvenido ${user.nombre || user.email}!`);
      if (user.rol === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="auth-title-large">Bienvenido de Vuelta</h2>
      <p className="auth-subtitle">Continúa tu viaje fitness hoy mismo</p>

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-form-group">
          <label className="auth-form-label">Correo Electrónico</label>
          <div className="auth-input-wrapper">
            <Mail className="auth-input-icon" size={18} />
            <input
              name="email"
              className="auth-form-input"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Contraseña</label>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon" size={18} />
            <input
              name="password"
              className="auth-form-input"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <p className="auth-error-text">{error}</p>}

        <button
          className="auth-form-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Iniciar Sesión"}
        </button>
      </form>

      <div className="auth-divider">O continúa con</div>

      <div className="social-buttons">
        <button className="social-btn" type="button">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
          Google
        </button>
        <button className="social-btn" type="button">
          <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" style={{ filter: 'invert(1)' }} />
          Apple
        </button>
      </div>

      <div className="auth-footer-text">
        <p>¿No tienes una cuenta? <Link to="/registro" className="auth-link">Crea una</Link></p>
      </div>
    </>
  );
}

export default FormLogin;
