import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Hash, Shield } from "lucide-react";
import Swal from 'sweetalert2';
import { registerUser, checkUserExists } from "../Services/userService.jsx";

function FormRegistro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    edad: "",
    rol: ""
  });

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

    // Simple validacion
    if (!formData.email || !formData.password || !formData.nombre || !formData.edad || !formData.rol) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios.',
        background: '#171212',
        color: '#ffffff',
        iconColor: '#7d2020',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    setLoading(true);
    try {
      // Verificar si el usuario ya existe
      const exists = await checkUserExists(formData.email);
      if (exists) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Este correo electrónico ya está registrado.',
          background: '#171212',
          color: '#ffffff',
          iconColor: '#7d2020',
          timer: 1500,
          showConfirmButton: false
        });
        setLoading(false);
        return;
      }

      const newUser = await registerUser(formData);
      localStorage.setItem("userId", newUser.id); // Guardamos el ID para el siguiente paso
      
      Swal.fire({
        icon: 'success',
        title: 'Usuario registrado correctamente',
        background: '#171212',
        color: '#ffffff',
        iconColor: '#7d2020',
        timer: 1500,
        showConfirmButton: false
      });

      setFormData({ email: "", password: "", nombre: "", edad: "", rol: "" });
      navigate("/perfil-salud");
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al registrar el usuario. Inténtalo de nuevo.',
        background: '#171212',
        color: '#ffffff',
        iconColor: '#7d2020',
        timer: 1500,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
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

          <div className="auth-form-group">
            <label className="auth-form-label">Rol de Cuenta</label>
            <div className="auth-input-wrapper">
              <Shield className="auth-input-icon" size={18} />
              <select
                className="auth-form-input"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              >
                <option value="" disabled>Selecciona un rol</option>
                <option value="admin">Administrador</option>
                <option value="client">Cliente</option>
              </select>
            </div>
          </div>
        </div>

        <label className="terms-checkbox">
          <input type="checkbox" required />
          <span>Acepto los <Link to="#" className="terms-link">Términos de Servicio</Link> y la <Link to="#" className="terms-link">Política de Privacidad</Link>.</span>
        </label>

        <button
          className="auth-form-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Cuenta"}
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
