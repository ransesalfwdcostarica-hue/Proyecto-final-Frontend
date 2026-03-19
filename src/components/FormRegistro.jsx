import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Hash, Shield } from "lucide-react";

function FormRegistro({ userData, onNext }) {
  const [formData, setFormData] = useState({
    email: userData?.email || "",
    password: userData?.password || "",
    nombre: userData?.nombre || "",
    edad: userData?.edad || ""
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

    // Validacion de espacios vacios
    if (!formData.email?.trim() || !formData.password?.trim() || !formData.nombre?.trim() || !formData.edad) {
      const msg = "Todos los campos son obligatorios.";
      setError(msg);
      alert(msg);
      return;
    }

    setLoading(true);
    // Simulate a brief loading state for UX
    setTimeout(() => {
      setLoading(false);
      onNext({ ...formData, rol: "client" });
    }, 500);
  };

  return (
    <>
      <h2 className="auth-title-large">Crear Cuenta</h2>
      <p className="auth-subtitle">Inicia tu viaje fitness hoy mismo</p>

      <form className="auth-form" onSubmit={handleRegister}>
        <div className="auth-form-group">
          <label className="auth-form-label">Nombre Completo</label>
          <div className="auth-input-wrapper">
            <User className="auth-input-icon" size={18} />
            <input
              name="nombre"
              className="auth-form-input"
              type="text"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
        </div>

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

        <div className="dual-group">
          <div className="auth-form-group">
            <label className="auth-form-label">Edad</label>
            <div className="auth-input-wrapper">
              <Hash className="auth-input-icon" size={18} />
              <input
                name="edad"
                className="auth-form-input"
                type="number"
                placeholder="Ej. 25"
                value={formData.edad}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <label className="terms-checkbox">
          <input type="checkbox" required />
          <span>Acepto los <Link to="#" className="terms-link">Términos de Servicio</Link> y la <Link to="#" className="terms-link">Política de Privacidad</Link>.</span>
        </label>

        {error && <p className="auth-error-text">{error}</p>}

        <button
          className="auth-form-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Continuando..." : "Siguiente"}
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
        <p>¿Ya tienes una cuenta? <Link to="/login" className="auth-link">Iniciar Sesión</Link></p>
      </div>
    </>
  );
}

export default FormRegistro;