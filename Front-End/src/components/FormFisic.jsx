import React, { useState } from 'react';
import { User, Utensils, Lock } from 'lucide-react';
import '../styles/FormFisic.css';

const ALERGIAS_PREDEFINIDAS = {
  alimentos: [
    { id: 'frutos_secos', label: 'Frutos secos / Nueces' },
    { id: 'mariscos', label: 'Mariscos' },
    { id: 'trigo', label: 'Trigo / Gluten' },
    { id: 'lacteos', label: 'Lácteos / Lactosa' },
    { id: 'huevo', label: 'Huevo' },
    { id: 'soya', label: 'Soya' },
    { id: 'pescado', label: 'Pescado' },
    { id: 'mani', label: 'Maní' },
    { id: 'legumbres', label: 'Legumbres' },
    { id: 'semillas', label: 'Semillas (Sésamo o Girasol)' },
    { id: 'frutas_citricas', label: 'Frutas cítricas' },
    { id: 'chocolate', label: 'Chocolate / Cacao' }
  ],
  medicamentos: [
    { id: 'analgesicos', label: 'Analgésicos (Ibuprofeno o Aspirina)' },
    { id: 'penicilina', label: 'Penicilina' },
    { id: 'sulfas', label: 'Sulfas' },
    { id: 'anestesicos', label: 'Anestésicos locales' },
    { id: 'antiinflamatorios', label: 'Antiinflamatorios no esteroides' }
  ],
  contacto: [
    { id: 'latex', label: 'Látex (en bandas o colchonetas)' },
    { id: 'niquel_goma', label: 'Níquel / Goma (en máquinas)' },
    { id: 'polvo_acaros', label: 'Polvo / Ácaros' },
    { id: 'polen', label: 'Polen' },
    { id: 'moho', label: 'Moho / Hongos ambientales' }
  ]
};

const FormFisic = ({ userData, onNext, onBack }) => {
  // Parse initial allergies if they exist
  const getInitialState = () => {
    const selected = [];
    let otra = "";
    
    if (userData.alergias) {
      const parts = userData.alergias.split(" Adicional: ");
      const predefinidasParte = parts[0] || "";
      otra = parts[1] || "";
      
      const allOptions = [
        ...ALERGIAS_PREDEFINIDAS.alimentos,
        ...ALERGIAS_PREDEFINIDAS.medicamentos,
        ...ALERGIAS_PREDEFINIDAS.contacto
      ];
      
      allOptions.forEach(opt => {
        if (predefinidasParte.includes(opt.label)) {
          selected.push(opt.id);
        }
      });
      
      // Fallback: if there was text but no checkboxes matched, put it all in "otra"
      if (selected.length === 0 && userData.alergias && !userData.alergias.startsWith("Ninguna")) {
        otra = userData.alergias;
      }
    }
    
    return { selected, otra };
  };

  const initialState = getInitialState();

  const [formData, setFormData] = useState({
    sexo: userData.sexo || "",
    altura: userData.altura || "",
    peso: userData.peso || "",
    lugarEntrenamiento: userData.lugarEntrenamiento || "",
  });

  const [selectedAllergies, setSelectedAllergies] = useState(initialState.selected);
  const [otraAlergia, setOtraAlergia] = useState(initialState.otra);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergyChange = (id) => {
    setSelectedAllergies(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.sexo || !formData.altura || !formData.peso || !formData.lugarEntrenamiento) {
      alert("Por favor complete todos los campos obligatorios.");
      return;
    }

    // Consolidate allergies using pipe delimiter to avoid comma conflicts
    const allOptions = [
      ...ALERGIAS_PREDEFINIDAS.alimentos,
      ...ALERGIAS_PREDEFINIDAS.medicamentos,
      ...ALERGIAS_PREDEFINIDAS.contacto
    ];
    
    const selectedLabels = allOptions
      .filter(opt => selectedAllergies.includes(opt.id))
      .map(opt => opt.label);

    let consolidadoAlergias = "";
    if (selectedLabels.length > 0) {
      consolidadoAlergias += selectedLabels.join("||");
    }
    
    if (otraAlergia.trim()) {
      consolidadoAlergias += consolidadoAlergias ? `||${otraAlergia.trim()}` : otraAlergia.trim();
    }

    if (!consolidadoAlergias) {
      consolidadoAlergias = "Ninguna";
    }

    onNext({
      ...formData,
      alergias: consolidadoAlergias
    });
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

            <div className="alergias-container">
              <span className="alergias-instruction-text">
                Seleccione cualquier alergia o intolerancia común que posea. Esto es fundamental para garantizar su seguridad durante las actividades y alimentación.
              </span>

              {/* Alergias de Alimentos */}
              <div className="alergias-grupo">
                <h3 className="grupo-titulo">Alergias Alimentarias</h3>
                <div className="checkbox-grid">
                  {ALERGIAS_PREDEFINIDAS.alimentos.map(opt => (
                    <label 
                      key={opt.id} 
                      className={`checkbox-label ${selectedAllergies.includes(opt.id) ? 'selected' : ''}`}
                    >
                      <input 
                        type="checkbox"
                        checked={selectedAllergies.includes(opt.id)}
                        onChange={() => handleAllergyChange(opt.id)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Alergias de Medicamentos */}
              <div className="alergias-grupo">
                <h3 className="grupo-titulo">Alergias a Medicamentos</h3>
                <div className="checkbox-grid">
                  {ALERGIAS_PREDEFINIDAS.medicamentos.map(opt => (
                    <label 
                      key={opt.id} 
                      className={`checkbox-label ${selectedAllergies.includes(opt.id) ? 'selected' : ''}`}
                    >
                      <input 
                        type="checkbox"
                        checked={selectedAllergies.includes(opt.id)}
                        onChange={() => handleAllergyChange(opt.id)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Alergias de Contacto */}
              <div className="alergias-grupo">
                <h3 className="grupo-titulo">Alergias a Materiales de Contacto</h3>
                <div className="checkbox-grid">
                  {ALERGIAS_PREDEFINIDAS.contacto.map(opt => (
                    <label 
                      key={opt.id} 
                      className={`checkbox-label ${selectedAllergies.includes(opt.id) ? 'selected' : ''}`}
                    >
                      <input 
                        type="checkbox"
                        checked={selectedAllergies.includes(opt.id)}
                        onChange={() => handleAllergyChange(opt.id)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Otras Alergias Textarea */}
              <div className="form-group full-width">
                <label>OTRAS ALERGIAS O DETALLES ADICIONALES</label>
                <textarea
                  name="otraAlergia"
                  placeholder="Describa aquí si tiene alguna otra alergia o detalle importante sobre su salud..."
                  rows="3"
                  value={otraAlergia}
                  onChange={(e) => setOtraAlergia(e.target.value)}
                ></textarea>
                <span className="helper-text">Esta información nos ayuda a ajustar sus rutinas y planes al máximo.</span>
              </div>
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-footer">
            <span className="footer-notice">
              * Sus datos están protegidos y se usan exclusivamente para su plan.
            </span>
            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  // Reconstruct consolidated string to pass back if needed
                  const allOptions = [
                    ...ALERGIAS_PREDEFINIDAS.alimentos,
                    ...ALERGIAS_PREDEFINIDAS.medicamentos,
                    ...ALERGIAS_PREDEFINIDAS.contacto
                  ];
                  const selectedLabels = allOptions
                    .filter(opt => selectedAllergies.includes(opt.id))
                    .map(opt => opt.label);
                  let consolidado = selectedLabels.join("||");
                  if (otraAlergia.trim()) {
                    consolidado += consolidado ? `||${otraAlergia.trim()}` : otraAlergia.trim();
                  }
                  onBack({
                    ...formData,
                    alergias: consolidado
                  });
                }}
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



