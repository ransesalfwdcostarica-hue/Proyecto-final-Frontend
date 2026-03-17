import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { registerUser } from '../Services/userService.js';
import { 
  Home, 
  Target, 
  BarChart3, 
  User, 
  Flame, 
  Utensils, 
  Info,
  ChevronRight
} from 'lucide-react';
import '../Styles/MetaUsuario.css';

const MetaUsuario = ({ userData, onBack }) => {
  const navigate = useNavigate();
  const [currentWeight, setCurrentWeight] = useState(userData.peso || 75.0);
  const [targetWeight, setTargetWeight] = useState(userData.pesoMeta || 70.0);
  const [duration, setDuration] = useState(userData.plazoSemanas || 8);
  const [loading, setLoading] = useState(false);

  const weightToLose = (currentWeight - targetWeight).toFixed(1);

  const handleStartPlan = async () => {
    const finalData = {
      ...userData,
      pesoActual: currentWeight,
      pesoMeta: targetWeight,
      plazoSemanas: duration,
      deficitEstimado: 450
    };

    setLoading(true);
    try {
      await registerUser(finalData);
      
      Swal.fire({
        icon: 'success',
        title: '¡Registro completo!',
        text: 'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.',
        background: '#171212',
        color: '#ffffff',
        iconColor: '#7d2020',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo completar el registro: ' + error.message,
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
    <div className="meta-usuario-layout">
      <div className="meta-main-container">
        {/* Left Sidebar */}
        <aside className="meta-sidebar">
          <div className="sidebar-section">
            <span className="section-label">MI SALUD</span>
            <span className="section-sublabel">Plan Personalizado</span>
          </div>
          
          <nav className="sidebar-nav">
            <button className="nav-item">
              <Home size={20} />
              <span>Inicio</span>
            </button>
            <button className="nav-item active">
              <Target size={20} />
              <span>Metas</span>
            </button>
            <button className="nav-item">
              <BarChart3 size={20} />
              <span>Progreso</span>
            </button>
            <button className="nav-item">
              <User size={20} />
              <span>Perfil</span>
            </button>
          </nav>

          <div className="sidebar-quote">
            <p className="quote-label">Consejo del día</p>
            <p className="quote-text">
              "La constancia vence a la Intensidad."
            </p>
          </div>
        </aside>

        {/* Central Content */}
        <main className="meta-content">
          <div className="content-header">
            <h1>Establecer Meta</h1>
            <p>Define tus objetivos y finaliza tu registro.</p>
          </div>

          <div className="goal-card">
            <div className="weight-inputs">
              <div className="input-group">
                <label>Peso actual (kg)</label>
                <input 
                  type="number" 
                  value={currentWeight} 
                  onChange={(e) => setCurrentWeight(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label>Meta de peso (kg)</label>
                <input 
                  type="number" 
                  value={targetWeight} 
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="lose-section">
              <div className="lose-header">
                <span>Peso total a perder</span>
                <span className="lose-amount">{weightToLose} kg</span>
              </div>
              <div className="range-container">
                <input 
                  type="range" 
                  className="weight-range"
                  min="0" 
                  max="20" 
                  step="0.5"
                  value={weightToLose}
                  readOnly
                />
              </div>
            </div>

            <div className="duration-section">
              <label>Plazo deseado</label>
              <div className="duration-grid">
                {[4, 8, 12].map((weeks) => (
                  <button 
                    key={weeks}
                    className={`duration-card ${duration === weeks ? 'active' : ''}`}
                    onClick={() => setDuration(weeks)}
                  >
                    <span className="duration-value">{weeks}</span>
                    <span className="duration-unit">SEMANAS</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="deficit-estimation">
              <div className="deficit-header">
                <BarChart3 size={18} className="red-icon" />
                <span>Estimación de Déficit</span>
              </div>
              <div className="deficit-value">
                <span className="negative">-450</span>
                <span className="unit">kcal / día</span>
              </div>
              <div className="deficit-footer">
                <Info size={14} className="info-icon" />
                <span>Recomendado: Pérdida saludable</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn-start-plan" 
                onClick={() => onBack({ peso: currentWeight, pesoMeta: targetWeight, plazoSemanas: duration })}
                style={{ background: '#333', flex: 1 }}
              >
                Atrás
              </button>
              <button 
                className="btn-start-plan" 
                onClick={handleStartPlan}
                disabled={loading}
                style={{ flex: 2 }}
              >
                {loading ? "Registrando..." : "Comenzar Plan"} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </main>

        {/* Right Widgets */}
        <aside className="meta-widgets">
          <div className="widget-card activity-widget">
            <div className="widget-header">
              <Flame size={18} className="red-icon" />
              <span>Actividad</span>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon-box food">
                  <Utensils size={16} />
                </div>
                <div className="activity-info">
                  <p className="activity-title">Nutrición</p>
                  <p className="activity-time">Plan listo</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MetaUsuario;


