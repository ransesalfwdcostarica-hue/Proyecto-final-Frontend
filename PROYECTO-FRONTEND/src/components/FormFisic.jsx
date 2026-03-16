import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updateUser } from '../Services/userService.jsx';
import '../Styles/FormFisic.css';

const FormFisic = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    edadFisica: "",
    sexo: "",
    altura: "",
    peso: "",
    lugarEntrenamiento: "",
    alergias: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'No se encontró sesión de usuario. Por favor regístrese de nuevo.',
        background: '#171212',
        color: '#ffffff',
        iconColor: '#7d2020',
        timer: 2000,
        showConfirmButton: false
      });
      navigate("/registro");
      return;
    }

    setLoading(true);
    try {
      await updateUser(userId, formData);
      Swal.fire({
        icon: 'success',
        title: '¡Perfil de salud actualizado!',
        background: '#171212',
        color: '#ffffff',
        iconColor: '#7d2020',
        timer: 1500,
        showConfirmButton: false
      });
      
      // No borramos el ID todavía, lo necesitamos para el último paso (MetaUsuario)
      navigate("/meta-usuario"); 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal',
        text: error.message || 'Error al actualizar el perfil.',
        background: '#171212',
        color: '#ffffff',
        iconColor: '#7d2020',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-fisic-container">
      <div className="form-fisic-header">
        <h1>Perfil de Salud</h1>
        <p>Complete su información física para personalizar su plan de entrenamiento y nutrición.</p>
      </div>

      <div className="form-fisic-card">
        <form onSubmit={handleSubmit}>
          {/* Section: Datos Físicos */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </span>
              Datos Físicos
            </h2>

            <div className="form-grid">
              {/* Row 1 / Col 1 */}
              <div className="form-group">
                <label>EDAD</label>
                <div className="input-wrapper">
                  <input 
                    name="edadFisica"
                    type="number" 
                    placeholder="Ej. 28" 
                    value={formData.edadFisica}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-suffix">años</span>
                </div>
              </div>

              {/* Row 1 / Col 2 */}
              <div className="form-group">
                <label>SEXO</label>
                <div className="select-wrapper">
                  <select 
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Seleccione una opción</option>
                    <option value="m">Masculino</option>
                    <option value="f">Femenino</option>
                    <option value="o">Otro</option>
                  </select>
                </div>
              </div>

              {/* Row 2 / Col 1 */}
              <div className="form-group">
                <label>ALTURA (CM)</label>
                <div className="input-wrapper">
                  <input 
                    name="altura"
                    type="number" 
                    placeholder="Ej. 175" 
                    value={formData.altura}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-suffix">cm</span>
                </div>
              </div>

              {/* Row 2 / Col 2 */}
              <div className="form-group">
                <label>PESO (KG)</label>
                <div className="input-wrapper">
                  <input 
                    name="peso"
                    type="number" 
                    step="0.1" 
                    placeholder="Ej. 74.5" 
                    value={formData.peso}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-suffix">kg</span>
                </div>
              </div>

              {/* Row 3 / Col 1 */}
              <div className="form-group">
                <label>LUGAR DE ENTRENAMIENTO</label>
                <div className="select-wrapper">
                  <select 
                    name="lugarEntrenamiento"
                    value={formData.lugarEntrenamiento}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Seleccione una opción</option>
                    <option value="gym">Gimnasio</option>
                    <option value="home">Casa</option>
                    <option value="outdoors">Aire Libre</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Nutrición & Alergias */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                </svg>
              </span>
              Nutrición & Alergias
            </h2>

            <div className="form-group full-width">
              <label>ALERGIAS O INTOLERANCIAS ALIMENTARIAS</label>
              <textarea 
                name="alergias"
                placeholder="Describa cualquier alergia (ej. frutos secos, lactosa, gluten) o restricción dietética..."
                rows="4"
                value={formData.alergias}
                onChange={handleChange}
              ></textarea>
              <span className="helper-text">Esta información es crucial para generar planes de comidas seguros.</span>
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-footer">
            <span className="footer-notice">
              * Sus datos están protegidos y se usan exclusivamente para su plan.
            </span>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Perfil"}
              <span className="icon-save">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormFisic;
