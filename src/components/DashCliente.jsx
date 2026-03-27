import { useEffect, useState, useContext } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  BarChart2,
  Settings,
  Plus,
  Flame,
  ChevronRight,
  LogOut,
  Home,
  Scale,
  Calendar,
  Target,
  Edit2,
  Check,
  X,
  Activity,
  Upload,
  User as UserIcon,
  Menu,
  TrendingUp,
  ClipboardList,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { obtenerTodosEjercicios } from '../Services/exerciseService';
import { updateUser } from '../Services/userService';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import SubirImagen from './SubirImagen';
import '../styles/DashboardCliente.css';

const DashCliente = () => {
  const { user, refreshUser, logout } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [progressForm, setProgressForm] = useState({
    pesoPerdido: '',
    feedbackDieta: '',
    feedbackEjercicio: '',
    semanasEnProgreso: user?.semanasEnProgreso || 1
  });

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (user) {
      setEditForm(user);
      setProgressForm(prev => ({
        ...prev,
        semanasEnProgreso: user.semanasEnProgreso || 1
      }));
      loadExercises();
    }
  }, [user]);

  const loadExercises = async () => {
    try {
      const data = await obtenerTodosEjercicios();
      setExercises(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading exercises:", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const calculateIMC = () => {
    if (!user?.pesoActual || !user?.altura) return 0;
    const peso = parseFloat(user.pesoActual);
    const altura = parseFloat(user.altura) / 100;
    return (peso / (altura * altura)).toFixed(1);
  };

  const getIMCCategory = (imcValue) => {
    if (imcValue < 18.5) return 'Bajo peso';
    if (imcValue < 25) return 'Normal';
    if (imcValue < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!editForm.pesoActual || !editForm.pesoMeta || !editForm.altura || !editForm.plazoSemanas) {
      alert("Por favor completa todos los campos del perfil.");
      return;
    }

    try {
      const updated = await updateUser(user.id, editForm);
      refreshUser(updated);
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'Tus datos han sido actualizados correctamente.',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron actualizar los datos.',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000'
      });
    }
  };

  const handleCloudinaryUpload = async (imageUrl) => {
    setEditForm(prev => ({ ...prev, avatar: imageUrl }));

    try {
      const updated = await updateUser(user.id, { ...user, avatar: imageUrl });

      refreshUser(updated);

      Swal.fire({
        icon: 'success',
        title: '¡Foto actualizada!',
        text: 'Tu foto de perfil se guardó correctamente.',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000',
        timer: 2000,
        showConfirmButton: false
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la foto.',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000'
      });
    }
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();

    try {
      const nuevoPesoActual = parseFloat(user.pesoActual) - (parseFloat(progressForm.pesoPerdido) || 0);
      const nuevasSemanas = parseInt(progressForm.semanasEnProgreso);

      const updateData = {
        ...user,
        pesoActual: nuevoPesoActual.toString(),
        semanasEnProgreso: nuevasSemanas,
        ultimoFeedbackDieta: progressForm.feedbackDieta,
        ultimoFeedbackEjercicio: progressForm.feedbackEjercicio
      };

      const updated = await updateUser(user.id, updateData);
      refreshUser(updated);

      setProgressForm(prev => ({
        ...prev,
        pesoPerdido: '',
        feedbackDieta: '',
        feedbackEjercicio: ''
      }));

      Swal.fire({
        icon: 'success',
        title: '¡Progreso Guardado!',
        text: `Has perdido ${progressForm.pesoPerdido}kg y vas por la semana ${nuevasSemanas}. ¡Sigue así!`,
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar tu progreso.',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000'
      });
    }
  };

  if (!user) return <div className="client-dashboard" style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Cargando...</div>;

  const imc = calculateIMC();

  return (
    <div className="client-dashboard animate-fade-in">
      {isMobileMenuOpen && (
        <div className="dash-mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`client-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', margin: 0 }}>
            <Flame color="#8b0000" fill="#8b0000" size={28} /> PowerFIT
          </h2>
          <button className="dash-mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-menu">
          <button
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button
            className={`menu-item ${activeTab === 'training' ? 'active' : ''}`}
            onClick={() => handleActiveTab('training')}
          >
            <Dumbbell size={20} />
            Entrenamientos
          </button>          <button
            className={`menu-item ${activeTab === 'nutrition' ? 'active' : ''}`}
            onClick={() => handleActiveTab('nutrition')}
          >
            <Utensils size={20} />
            Recomendaciones Nutricionales
          </button>
          <button
            className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleActiveTab('settings')}
          >
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
          <button className="menu-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </nav>

        <div className="sidebar-profile">
          <img
            src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
            alt="Avatar"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h4>{user.nombre || 'Usuario'}</h4>
            <p>{user.rol === 'admin' ? 'Administrador' : 'Atleta Pro'}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="client-main">
        <header className="client-header">
          <div className="header-title-wrapper">
            <button className="dash-mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={28} />
            </button>
            <div className="header-title">
              <h1>{activeTab === 'dashboard' ? 'Panel de Rendimiento' :
                activeTab === 'training' ? 'Biblioteca de Entrenamiento' :
                  activeTab === 'nutrition' ? 'Recomendaciones Nutricionales' : 'Ajustes de Cuenta'}</h1>
              <p>¡Hola {user.nombre}! Estas {activeTab === 'dashboard' ? 'son tus estadísticas del día.' : 'es tu sección personalizada.'}</p>
            </div>
          </div>
          <div className="header-actions">
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            {/* Hero Cards */}
            <section className="hero-cards">
              <div className="hero-card maroon">
                <div className="card-content">
                  <h3>Progreso de Peso</h3>
                  <p>Meta: {user.pesoMeta}kg | Actual: {user.pesoActual}kg</p>
                </div>
                <div className="card-icon-box">
                  <Target size={24} />
                </div>
              </div>
              <div className="hero-card dark">
                <div className="card-content">
                  <h3>Déficit Diario Calórico</h3>
                  <p>{user.deficitEstimado} kcal recomendadas</p>
                </div>
                <div className="card-icon-box">
                  <Flame size={24} />
                </div>
              </div>
            </section>

            {/* Stats Grid */}
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <span>Peso Actual</span>
                  <Scale size={18} />
                </div>
                <div className="stat-value">{user.pesoActual} kg</div>
                <div className="stat-change positive">Iniciaste con {user.peso} kg</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <span>IMC (BMI)</span>
                  <BarChart2 size={18} />
                </div>
                <div className="stat-value">{imc}</div>
                <div className="stat-change" style={{ color: parseFloat(imc) < 25 ? '#4ade80' : '#facc15' }}>
                  {getIMCCategory(parseFloat(imc))}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <span>Semana de Progreso</span>
                  <Calendar size={18} />
                </div>
                <div className="stat-value">{user.semanasEnProgreso || 1}</div>
                <div className="stat-change">De {user.plazoSemanas} semanas</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <span>Altura Registrada</span>
                  <Activity size={18} />
                </div>
                <div className="stat-value">{user.altura} cm</div>
                <div className="progress-bar-mini">
                  <div className="progress-fill" style={{ width: '100%' }}></div>
                </div>
              </div>
            </section>

            {/* Formulario de Progreso */}
            <section className="progress-form-card animate-fade-in shadow-premium">
              <div className="section-header">
                <h2><TrendingUp size={24} color="#ff4d4d" /> Cómo va tu progreso?</h2>
                <p>Ingresa tus avances para ajustar tu plan nutricional y de entrenamiento.</p>
              </div>
              <form onSubmit={handleProgressSubmit}>
                <div className="progress-grid">
                  <div className="progress-field">
                    <label>Peso que has perdido (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Ej: 0.5"
                      required
                      value={progressForm.pesoPerdido}
                      onChange={e => setProgressForm({ ...progressForm, pesoPerdido: e.target.value })}
                    />
                  </div>
                  <div className="progress-field">
                    <label>Semana actual de progreso</label>
                    <input
                      type="number"
                      required
                      value={progressForm.semanasEnProgreso}
                      onChange={e => setProgressForm({ ...progressForm, semanasEnProgreso: e.target.value })}
                    />
                  </div>
                  <div className="progress-field full-width">
                    <label>¿Cómo te ha ido con las recomendaciones de dieta?</label>
                    <textarea
                      placeholder="agrega tu respuesta"
                      required
                      value={progressForm.feedbackDieta}
                      onChange={e => setProgressForm({ ...progressForm, feedbackDieta: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="progress-field full-width">
                    <label>¿Cómo te ha ido con los ejercicios?</label>
                    <textarea
                      placeholder="agrega tu respuesta"
                      value={progressForm.feedbackEjercicio}
                      onChange={e => setProgressForm({ ...progressForm, feedbackEjercicio: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <button type="submit" className="btn-progress-save">
                  <ClipboardList size={20} /> Actualizar Mi Progreso
                </button>
              </form>
            </section>

            {/* Mid Section */}
            <div className="mid-section">
              <section className="chart-card">
                <div className="section-header">
                  <h2>Resumen de Salud</h2>
                </div>
                <div className="health-details">
                  <div className="health-row">
                    <span>Lugar:</span>
                    <strong>{user.lugarEntrenamiento || 'No especificado'}</strong>
                  </div>
                  <div className="health-row">
                    <span>Alergias:</span>
                    <strong style={{ color: user.alergias?.toLowerCase() === 'no' || user.alergias?.toLowerCase() === 'ninguna' ? '#4ade80' : '#ff4d4d' }}>
                      {user.alergias || 'Ninguna'}
                    </strong>
                  </div>
                  <div className="health-row">
                    <span>Sexo:</span>
                    <strong>{user.sexo === 'm' ? 'Masculino' : 'Femenino'}</strong>
                  </div>
                  <div className="health-row">
                    <span>Edad:</span>
                    <strong>{user.edad} años</strong>
                  </div>
                </div>
              </section>

              <section className="summary-card">
                <div className="section-header">
                  <h2>Distribución Macros (Est.)</h2>
                </div>
                <div className="summary-list">
                  <div className="summary-item">
                    <div className="item-label"><span className="dot red"></span> Proteína</div>
                    <strong>{Math.round(parseFloat(user.pesoActual) * 2)}g</strong>
                  </div>
                  <div className="summary-item">
                    <div className="item-label"><span className="dot orange"></span> Grasas</div>
                    <strong>{Math.round(parseFloat(user.pesoActual) * 0.8)}g</strong>
                  </div>
                  <div className="summary-item">
                    <div className="item-label"><span className="dot grey"></span> Carbohidratos</div>
                    <strong>Variable</strong>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}



        {activeTab === 'training' && (
          <section className="training-view animate-fade-in">
            <div className="section-header-row">
              <div className="header-text">
                <h2>Mis Rutinas Personalizadas</h2>
                <p>Aquí verás los ejercicios que has elegido de la biblioteca y los agruparemos por músculo.</p>
              </div>
              <Link to="/ejercicios" className="btn-add-training-global">
                <Plus size={18} /> Añadir Más Ejercicios
              </Link>
            </div>
            {loading ? (
              <p>Cargando ejercicios...</p>
            ) : (
              <div className="grouped-exercises-container">
                {user.ejerciciosElegidos && user.ejerciciosElegidos.length > 0 ? (
                  Object.entries(
                    exercises
                      .filter(ex => user.ejerciciosElegidos.includes(ex.id))
                      .reduce((acc, ex) => {
                        const cat = ex.categoria || 'Otros';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(ex);
                        return acc;
                      }, {})
                  ).map(([category, items]) => (
                    <div key={category} className="muscle-group-section">
                      <h3 className="muscle-group-title">
                        <Dumbbell size={20} color="#ff4d4d" /> {category}
                      </h3>
                      <div className="exercises-mini-grid">
                        {items.map(ex => (
                          <div key={ex.id} className="exercise-mini-card">
                            <div className="mini-card-img">
                              <img src={ex.imagen} alt={ex.nombre} />
                            </div>
                            <div className="mini-card-text">
                              <h4>{ex.nombre}</h4>
                              <div className="mini-card-tags">
                                <span className="tag-lvl">{ex.nivel}</span>
                                <span className="tag-time">{ex.tiempo}</span>
                              </div>
                              <button className="btn-mini-technique" onClick={() => setSelectedTechnique(ex)}>
                                <Play size={14} fill="currentColor" />
                                Ver técnica
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-exercises">
                    <h3>Aún no has elegido ejercicios</h3>
                    <p>Ve a la biblioteca de entrenamientos para seleccionar los que más te gusten.</p>
                    <Link to="/ejercicios" className="btn-primary-small">
                      <Plus size={18} /> Explorar Biblioteca
                    </Link>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'nutrition' && (
          <section className="nutrition-view animate-fade-in">
            <div className="nutrition-info-card">
              <div className="info-icon-large"><Utensils size={40} /></div>
              <h2>Tu Plan Nutricional</h2>
              <p>Basado en tu objetivo de <strong>{user.pesoMeta}kg</strong>, tu déficit diario es de <strong>{user.deficitEstimado} kcal</strong>.</p>
              <div className="nutrition-tips">
                <div className="tip-item">
                  <div className="tip-dot"></div>
                  <p>Bebe al menos 3 litros de agua al día para mantenerte hidratado.</p>
                </div>
                <div className="tip-item">
                  <div className="tip-dot"></div>
                  <p>Prioriza el consumo de proteínas en cada comida ({Math.round(parseFloat(user.pesoActual) * 2)}g totales).</p>
                </div>
                <div className="tip-item">
                  <div className="tip-dot"></div>
                  <p>Evita alimentos ultraprocesados y enfócate en comida real.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="settings-view animate-fade-in">
            <div className="settings-card shadow-premium">
              <div className="settings-header-box">
                <div className="header-text">
                  <h2>Editar mi Perfil</h2>
                  <p>Gestiona tu información personal y apariencia.</p>
                </div>
                <button
                  className={`btn-toggle-edit ${isEditing ? 'editing' : ''}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <X size={20} /> : <Edit2 size={20} />}
                </button>
              </div>

              <div className="avatar-edit-section">
                <div className="avatar-preview-container">
                  <img
                    src={editForm.avatar || user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                    alt="Avatar Preview"
                    className="avatar-large-preview"
                  />
                  {isEditing && (
                    <div className="avatar-overlay">
                      <SubirImagen onImageUpload={handleCloudinaryUpload}>
                        <label className="upload-icon-label" style={{ cursor: 'pointer' }}>
                          <Upload size={24} />
                        </label>
                      </SubirImagen>
                    </div>
                  )}
                </div>
                <div className="avatar-tips">
                  <h3>Foto de Perfil</h3>
                  <p>Sube una imagen cuadrada para mejores resultados.</p>
                </div>
              </div>

              <form className="settings-dynamic-form" onSubmit={handleUpdateUser}>
                <div className="form-settings-grid">
                  <div className="form-field">
                    <label>Peso Actual (kg)</label>
                    <input
                      type="number"
                      readOnly={!isEditing}
                      value={editForm.pesoActual}
                      onChange={e => setEditForm({ ...editForm, pesoActual: e.target.value })}
                      className={!isEditing ? 'readonly' : ''}
                    />
                  </div>
                  <div className="form-field">
                    <label>Peso Meta (kg)</label>
                    <input
                      type="number"
                      readOnly={!isEditing}
                      value={editForm.pesoMeta}
                      onChange={e => setEditForm({ ...editForm, pesoMeta: e.target.value })}
                      className={!isEditing ? 'readonly' : ''}
                    />
                  </div>
                  <div className="form-field">
                    <label>Altura (cm)</label>
                    <input
                      type="number"
                      readOnly={!isEditing}
                      value={editForm.altura}
                      onChange={e => setEditForm({ ...editForm, altura: e.target.value })}
                      className={!isEditing ? 'readonly' : ''}
                    />
                  </div>
                  <div className="form-field">
                    <label>Plazo Semanas</label>
                    <input
                      type="number"
                      readOnly={!isEditing}
                      value={editForm.plazoSemanas}
                      onChange={e => setEditForm({ ...editForm, plazoSemanas: e.target.value })}
                      className={!isEditing ? 'readonly' : ''}
                    />
                  </div>
                </div>
                {isEditing && (
                  <button type="submit" className="btn-save-premium">
                    <Check size={18} /> Aplicar Cambios
                  </button>
                )}
              </form>
            </div>
          </section>
        )}
      </main>
      <TechniqueModal exercise={selectedTechnique} onClose={() => setSelectedTechnique(null)} />
    </div>
  );
};

/* Técnica Modal Helper Component */
const TechniqueModal = ({ exercise, onClose }) => {
  if (!exercise) return null;
  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>Técnica: {exercise.nombre}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        <div className="modal-body" style={{ padding: '20px' }}>
          {exercise.videoUrl ? (
            <div className="video-responsive">
              <iframe 
                width="100%" 
                height="315" 
                src={exercise.videoUrl} 
                title={exercise.nombre}
                frameBorder="0" 
                style={{ borderRadius: '12px' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
              <Dumbbell size={48} style={{ opacity: 0.2, marginBottom: '15px' }} />
              <p>El video de técnica para este ejercicio aún no está disponible.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashCliente;
