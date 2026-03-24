import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, CheckCircle, X } from "lucide-react";
import { loginUser } from "../services/userService";
import "../styles/Login.css";

function FormLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
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

    if (!formData.email?.trim() || !formData.password?.trim()) {
      const msg = "Por favor, completa todos los campos.";
      setError(msg);
      alert(msg);
      return;
    }

    setLoading(true);
    try {
      const user = await loginUser(formData.email, formData.password);

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      setNotificationMsg(`¡Bienvenido ${user.nombre || user.email}!`);
      setIsNotificationOpen(true);

      // Store a temporary flag for the redirect to wait for the modal if needed, 
      // but here we can just wait 1.5s or handle on close
      setTimeout(() => {
        if (user.rol === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }, 1500);
    } catch (err) {
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="auth-split-card">
        <div className="auth-image-side" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop')" }}>
          <div className="auth-image-overlay">
            <h2>Eleva tu<br /><span>Rendimiento</span></h2>
            <p>Únete a miles de atletas que hacen seguimiento de sus medidas y alcanzan nuevas metas cada día.</p>
          </div>
        </div>
        <div className="auth-form-side">
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

            {/* Modal de Notificación Personalizada */}
            {isNotificationOpen && (
              <div className="notification-overlay">
                <div className="notification-content animate-fade-in success">
                  <div className="notification-icon-container">
                    <CheckCircle size={48} color="#05cd99" />
                  </div>
                  <h3>Inicio de Sesión Exitoso</h3>
                  <p>{notificationMsg}</p>
                  <p className="redirect-hint">Redirigiendo a tu panel...</p>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}

export default FormLogin;
