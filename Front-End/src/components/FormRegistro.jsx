import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, Hash } from "lucide-react";
import Swal from "sweetalert2";

function FormRegistro({ userData, onNext }) {
  const [formData, setFormData] = useState({
    email: userData?.email || "",
    password: userData?.password || "",
    nombre: userData?.nombre || "",
    edad: userData?.edad || ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (!formData.edad) {
      newErrors.edad = "La edad es obligatoria.";
    } else if (Number(formData.edad) < 13 || Number(formData.edad) > 100) {
      newErrors.edad = "La edad debe estar entre 13 y 100 años.";
    }
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire({
        title: "Datos incompletos",
        text: Object.values(validationErrors)[0],
        icon: "warning",
        background: "#171212",
        color: "#fff",
        confirmButtonColor: "#8b0000"
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext({ ...formData, edad: Number(formData.edad), rol: "client" });
    }, 400);
  };

  return (
    <>
      <h2 className="auth-title-large">Crear Cuenta</h2>
      <p className="auth-subtitle">Inicia tu viaje fitness hoy mismo</p>

      <form className="auth-form" onSubmit={handleRegister} noValidate>
        <div className="auth-form-group">
          <label className="auth-form-label">Nombre Completo</label>
          <div className="auth-input-wrapper">
            <User className="auth-input-icon" size={18} />
            <input
              id="reg-nombre"
              name="nombre"
              className={`auth-form-input ${errors.nombre ? "input-error" : ""}`}
              type="text"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          {errors.nombre && <p className="auth-error-text">{errors.nombre}</p>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Correo Electrónico</label>
          <div className="auth-input-wrapper">
            <Mail className="auth-input-icon" size={18} />
            <input
              id="reg-email"
              name="email"
              className={`auth-form-input ${errors.email ? "input-error" : ""}`}
              type="email"
              placeholder="nombre@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="auth-error-text">{errors.email}</p>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Contraseña</label>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon" size={18} />
            <input
              id="reg-password"
              name="password"
              className={`auth-form-input ${errors.password ? "input-error" : ""}`}
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {errors.password && <p className="auth-error-text">{errors.password}</p>}
        </div>

        <div className="dual-group">
          <div className="auth-form-group">
            <label className="auth-form-label">Edad</label>
            <div className="auth-input-wrapper">
              <Hash className="auth-input-icon" size={18} />
              <input
                id="reg-edad"
                name="edad"
                className={`auth-form-input ${errors.edad ? "input-error" : ""}`}
                type="number"
                placeholder="Ej. 25"
                min="13"
                max="100"
                value={formData.edad}
                onChange={handleChange}
              />
            </div>
            {errors.edad && <p className="auth-error-text">{errors.edad}</p>}
          </div>
        </div>

        <label className="terms-checkbox">
          <input type="checkbox" required />
          <span>
            Acepto los <Link to="#" className="terms-link">Términos de Servicio</Link> y la{" "}
            <Link to="#" className="terms-link">Política de Privacidad</Link>.
          </span>
        </label>

        <button className="auth-form-button" type="submit" disabled={loading}>
          {loading ? "Continuando..." : "Siguiente →"}
        </button>
      </form>

      <div className="auth-divider">O continúa con</div>

      <div className="social-buttons">
        <button className="social-btn" type="button">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
          Google
        </button>
        <button className="social-btn" type="button">
          <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" style={{ filter: "invert(1)" }} />
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
