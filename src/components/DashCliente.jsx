import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  BarChart2, 
  Settings, 
  Plus, 
  Bell, 
  Flame, 
  Footprints, 
  Moon, 
  Droplets,
  ChevronRight,
  LogOut,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Styles/DashboardCliente.css';

const DashCliente = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) return <div className="client-dashboard">Cargando...</div>;

  return (
    <div className="client-dashboard animate-fade-in">
      {/* Sidebar */}
      <aside className="client-sidebar">
        <div className="sidebar-logo">
      
         
        </div>

        <nav className="sidebar-menu">
          <button className="menu-item active">
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button className="menu-item">
            <Dumbbell size={20} />
            Entrenamientos
          </button>
          <button className="menu-item">
            <Utensils size={20} />
            Nutrición
          </button>
          <button className="menu-item">
            <BarChart2 size={20} />
            Analíticas
          </button>
          <button className="menu-item">
            <Settings size={20} />
            Ajustes
          </button>
          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="menu-item">
              <Home size={20} />
              Volver al Inicio
            </button>
          </Link>
          <button className="menu-item" onClick={handleLogout} style={{ marginTop: 'auto', color: '#ff4d4d' }}>
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </nav>

        <div className="sidebar-profile">
          <img 
            src={`https://ui-avatars.com/api/?name=${user.nombre || user.email}&background=8b0000&color=fff`} 
            alt="Avatar" 
            className="profile-avatar" 
          />
          <div className="profile-info">
            <h4>{user.nombre || 'Usuario'}</h4>
            <p>{user.rol === 'client' ? 'Atleta Pro' : 'Administrador'}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="client-main">
        <header className="client-header">
          <div className="header-title">
            <h1>Panel de Rendimiento</h1>
            <p>¡Bienvenido de nuevo, {user.nombre}! Día 14 de tu racha actual.</p>
          </div>
          <div className="header-actions">
            <button className="btn-new">
              <Plus size={18} />
              Nueva Actividad
            </button>
          </div>
        </header>

        {/* Hero Cards */}
        <section className="hero-cards">
          <div className="hero-card maroon">
            <div className="card-content">
              <h3>Mi Rutina</h3>
              <p>Ver plan de hoy</p>
            </div>
            <div className="card-icon-box">
              <ChevronRight size={20} />
            </div>
          </div>
          <div className="hero-card dark">
            <div className="card-content">
              <h3>Crear Rutina Personalizada</h3>
              <p>Diseña tu propio entrenamiento</p>
            </div>
            <div className="card-icon-box">
              <Plus size={20} />
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span>Pasos Diarios</span>
              <Footprints size={16} />
            </div>
            <div className="stat-value">12,482</div>
            <div className="stat-change positive">+14% vs promedio</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span>Calorías Quemadas</span>
              <Flame size={16} />
            </div>
            <div className="stat-value">842 kcal</div>
            <div className="stat-change positive">+5% hoy</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span>Calidad de Sueño</span>
              <Moon size={16} />
            </div>
            <div className="stat-value">92%</div>
            <div className="stat-change positive" style={{color: '#4ade80'}}>Excelente recuperación</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span>Hidratación</span>
              <Droplets size={16} />
            </div>
            <div className="stat-value">2.4L</div>
            <div className="progress-bar-mini" style={{ height: '4px', background: '#2a2a2e', borderRadius: '2px', marginTop: '10px' }}>
              <div style={{ width: '70%', height: '100%', background: '#8b0000', borderRadius: '2px' }}></div>
            </div>
          </div>
        </section>

        {/* Mid Section */}
        <div className="mid-section">
          <section className="chart-card">
            <div className="section-header">
              <h2>Progreso de Peso</h2>
              <select className="dark-select">
                <option>Últimos 30 días</option>
              </select>
            </div>
            <div className="dummy-chart">
              <div className="bar" style={{ height: '40%' }}></div>
              <div className="bar" style={{ height: '60%' }}></div>
              <div className="bar active" style={{ height: '85%' }}></div>
              <div className="bar" style={{ height: '50%' }}></div>
              <div className="bar" style={{ height: '70%' }}></div>
              <div className="bar" style={{ height: '45%' }}></div>
              <div className="bar active" style={{ height: '90%' }}></div>
            </div>
          </section>

          <section className="summary-card">
            <div className="section-header">
              <h2>Resumen Nutricional</h2>
            </div>
            <div className="dummy-donut">
              <div className="donut-inner">
                <h4>1,840</h4>
                <span>restantes</span>
              </div>
            </div>
            <div className="summary-list">
              <div className="summary-item">
                <div className="item-label"><span className="dot red"></span> Proteína</div>
                <strong>142g / 180g</strong>
              </div>
              <div className="summary-item">
                <div className="item-label"><span className="dot orange"></span> Carbos</div>
                <strong>210g / 250g</strong>
              </div>
              <div className="summary-item">
                <div className="item-label"><span className="dot grey"></span> Grasas</div>
                <strong>52g / 70g</strong>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashCliente;
