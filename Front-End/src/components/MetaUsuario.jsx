import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import '../styles/MetaUsuario.css';

const MetaUsuario = ({ userData, onBack }) => {
  const navigate = useNavigate();
  const [currentWeight, setCurrentWeight] = useState(userData.peso || 75.0);
  const [targetWeight, setTargetWeight] = useState(userData.pesoMeta || 70.0);
  const [duration, setDuration] = useState(userData.plazoSemanas || 8);
  const [loading, setLoading] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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

      setIsNotificationOpen(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de Registro',
        text: error.message || 'No se pudo completar el registro.',
        background: '#171212',
        color: '#ffffff',
        iconColor: '#7d2020',
        timer: 3000,
        showConfirmButton: true,
        confirmButtonColor: '#8b0000'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="meta-usuario-layout">
        <div className="meta-main-container">


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
                  <span>{currentWeight >= targetWeight ? 'Peso total a perder' : 'Peso total a ganar'}</span>
                  <span className="lose-amount">{Math.abs(weightToLose)} kg</span>
                </div>
                <div className="range-container">
                  <input
                    type="range"
                    className="weight-range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={Math.abs(weightToLose)}
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
                <div className="deficit-info-group">
                  <div className="deficit-header">
                    <BarChart3 size={18} className="red-icon" />
                    <span>Estimación de Déficit</span>
                  </div>
                  <div className="deficit-footer">
                    <Info size={14} className="info-icon" />
                    <span>Recomendado: Pérdida saludable</span>
                  </div>
                </div>
                <div className="deficit-value">
                  <span className="negative">-450</span>
                  <span className="unit">kcal / día</span>
                </div>
              </div>

              <div className="meta-actions">
                <button
                  className="btn-back"
                  onClick={() => onBack({ peso: currentWeight, pesoMeta: targetWeight, plazoSemanas: duration })}
                >
                  Atrás
                </button>
                <button
                  className="btn-start"
                  onClick={handleStartPlan}
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "Comenzar Plan"} <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </main>


        </div>
      </div>

      {/* Modal de Notificación Personalizada */}
      {isNotificationOpen && (
        <div className="notification-overlay">
          <div className="notification-content animate-fade-in success">
            <div className="notification-icon-container">
              <CheckCircle size={48} color="#05cd99" />
            </div>
            <h3>¡Cuenta Creada!</h3>
            <p>Tu registro ha sido exitoso. Ahora puedes iniciar sesión para acceder a tu perfil fitness.</p>
            <div className="modal-actions-column">
              <Link to="/login" className="btn-notification">Ir al Inicio de Sesión</Link>
              <button
                className="btn-cancel-link"
                onClick={() => setIsNotificationOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MetaUsuario;


