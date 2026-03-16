import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updateUser } from '../Services/userService.jsx';
import { 
  Home, 
  Target, 
  BarChart3, 
  User, 
  Bell, 
  CircleUser, 
  Search, 
  Flame, 
  Utensils, 
  Info,
  ChevronRight
} from 'lucide-react';
import '../Styles/MetaUsuario.css';

const MetaUsuario = () => {
  const navigate = useNavigate();
  const [currentWeight, setCurrentWeight] = useState(75.0);
  const [targetWeight, setTargetWeight] = useState(70.0);
  const [duration, setDuration] = useState(8);
  const [loading, setLoading] = useState(false);

  const weightToLose = (currentWeight - targetWeight).toFixed(1);

  const handleStartPlan = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Por favor inicie el proceso de nuevo.',
        background: '#171212',
        color: '#ffffff',
        iconColor: '#7d2020',
        timer: 2000,
        showConfirmButton: false
      });
      navigate("/registro");
      return;
    }

    const goalData = {
      pesoActual: currentWeight,
      pesoMeta: targetWeight,
      plazoSemanas: duration,
      deficitEstimado: 450
    };

    setLoading(true);
    try {
      await updateUser(userId, goalData);
      
      Swal.fire({
        icon: 'success',
        title: '¡Registro completo!',
        text: 'Ahora puedes iniciar sesión.',
        background: '#171212',
        color: '#ffffff',
        iconColor: '#7d2020',
        timer: 1500,
        showConfirmButton: false
      });

      localStorage.removeItem("userId"); // Finalizamos el flujo de registro
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la meta: ' + error.message,
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
              "La constancia vence a la Intensidad. Enfócate en metas sostenibles."
            </p>
          </div>
        </aside>

        {/* Central Content */}
        <main className="meta-content">
          <div className="content-header">
            <h1>Establecer Meta de Peso</h1>
            <p>Define tus objetivos y personaliza tu plan de nutrición basado en ciencia.</p>
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
                <span>Recomendado: Pérdida saludable de 0.6kg/semana</span>
              </div>
            </div>

            <button 
              className="btn-start-plan" 
              onClick={handleStartPlan}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Comenzar Plan"} <ChevronRight size={18} />
            </button>
          </div>
        </main>

        {/* Right Widgets */}
        <aside className="meta-widgets">
          <div className="widget-card activity-widget">
            <div className="widget-header">
              <Flame size={18} className="red-icon" />
              <span>Actividad Reciente</span>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon-box runner">
                  <span className="runner-icon">🏃</span>
                </div>
                <div className="activity-info">
                  <p className="activity-title">Carrera Matutina</p>
                  <p className="activity-time">Hoy, 8:15 AM</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon-box food">
                  <Utensils size={16} />
                </div>
                <div className="activity-info">
                  <p className="activity-title">Desayuno Proteico</p>
                  <p className="activity-time">Hoy, 9:30 AM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="widget-card community-widget">
            <h3>Comunidad</h3>
            <p>Únete a más de 5,000 personas que están logrando sus metas este mes.</p>
            <div className="community-avatars">
              <div className="avatar-stack">
                <img src="https://i.pravatar.cc/32?img=1" alt="user" />
                <img src="https://i.pravatar.cc/32?img=2" alt="user" />
                <img src="https://i.pravatar.cc/32?img=3" alt="user" />
                <div className="avatar-more">+12</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer className="meta-footer">
        <p>© 2024 HealthPlatform. Todos los derechos reservados.</p>
        <div className="footer-links">
          <span>Privacidad</span>
          <span>Términos</span>
          <span>Soporte</span>
        </div>
      </footer>
    </div>
  );
};

export default MetaUsuario;
