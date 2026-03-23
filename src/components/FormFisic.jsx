import React, { useState } from 'react';
import { User, Utensils, Lock, ChevronRight } from 'lucide-react';
import '../styles/FormFisic.css';

const FormFisic = ({ userData, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    edadFisica: userData.edadFisica || "",
    sexo: userData.sexo || "",
    altura: userData.altura || "",
    peso: userData.peso || "",
    lugarEntrenamiento: userData.lugarEntrenamiento || "",
    alergias: userData.alergias || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.edadFisica || !formData.sexo || !formData.altura || !formData.peso || !formData.lugarEntrenamiento) {
      alert("Por favor complete todos los campos obligatorios.");
      return;
    }

    onNext(formData);
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
                <User size={20} />
              </span>
              Datos Físicos
            </h2>

            <div className="form-grid">
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
                  </select>
                </div>
              </div>

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

              <div className="form-group full-width">
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

          <div className="form-section">
            <h2 className="section-title">
              <span className="icon">
                <Utensils size={20} />
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
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => onBack(formData)}
                className="btn-back"
              >
                Atrás
              </button>
              <button type="submit" className="btn-submit">
                Guardar Perfil
                <span className="icon-save">
                  <Lock size={18} />
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormFisic;


