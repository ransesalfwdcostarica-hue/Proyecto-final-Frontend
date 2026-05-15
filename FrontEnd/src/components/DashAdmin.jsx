import React, { useState, useContext } from 'react';
import {
  LayoutDashboard, Users, Dumbbell, Mail, Home,
  X, Menu, AlertTriangle, Settings,
  Image as ImageIcon, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import DashboardAdministrador from './DashboardAdministrador';
import AdminUsers from './AdminUsers';
import AdminExercises from './AdminExercises';
import AdminMessages from './AdminMessages';
import AdminReports from './AdminReports';
import AdminSettings from './AdminSettings';
import { crearEjercicio } from '../Services/exerciseService';
import Swal from 'sweetalert2';
import '../Styles/dashboard.css';

const DashAdmin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(UserContext);

  const [newExercise, setNewExercise] = useState({
    nombre: '',
    nivel: 'PRINCIPIANTE',
    musculo: '',
    tiempo: '',
    imagen: '',
    categoria: 'Pecho'
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (newExercise.nombre.trim().length < 3) {
      return Swal.fire({ title: 'Validación', text: 'El nombre debe tener al menos 3 caracteres.', icon: 'warning', background: '#0f0f0f', color: '#fff' });
    }
    if (newExercise.musculo.trim().length < 3) {
      return Swal.fire({ title: 'Validación', text: 'Especifique un músculo válido.', icon: 'warning', background: '#0f0f0f', color: '#fff' });
    }
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(newExercise.imagen)) {
      return Swal.fire({ title: 'Validación', text: 'La URL de la imagen no es válida.', icon: 'warning', background: '#0f0f0f', color: '#fff' });
    }

    try {
      setProcessing(true);
      await crearEjercicio(newExercise);
      setShowAddModal(false);
      setNewExercise({ nombre: '', nivel: 'PRINCIPIANTE', musculo: '', tiempo: '', imagen: '', categoria: 'Pecho' });
      window.dispatchEvent(new CustomEvent('refreshExercises'));
      Swal.fire({ title: '¡Éxito!', text: 'El ejercicio ha sido agregado.', icon: 'success', background: '#0f0f0f', color: '#fff', confirmButtonColor: '#e11d48' });
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo agregar el ejercicio.', icon: 'error', background: '#0f0f0f', color: '#fff', confirmButtonColor: '#e11d48' });
    } finally {
      setProcessing(false);
    }
  };

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'users',    icon: Users,          label: 'Usuarios' },
    { id: 'messages', icon: Mail,           label: 'Mensajes' },
    { id: 'reports',  icon: AlertTriangle,  label: 'Reportes' },
    { id: 'exercises',icon: Dumbbell,       label: 'Ejercicios' },
    { id: 'settings', icon: Settings,       label: 'Ajustes' },
  ];



  const renderContent = () => {
    const openAddModal = () => setShowAddModal(true);
    switch (activeTab) {
      case 'overview':  return <DashboardAdministrador changeTab={setActiveTab} openAddModal={openAddModal} />;
      case 'users':     return <AdminUsers />;
      case 'exercises': return <AdminExercises openAddModal={openAddModal} />;
      case 'messages':  return <AdminMessages />;
      case 'reports':   return <AdminReports />;
      case 'settings':  return <AdminSettings />;
      default:          return <DashboardAdministrador changeTab={setActiveTab} openAddModal={openAddModal} />;
    }
  };

  const adminName = user?.nombre || user?.email?.split('@')[0] || 'Admin';
  const adminInitial = adminName.charAt(0).toUpperCase();

  return (
    <div className="da-layout">
      {/* ── Sidebar ── */}
      {isSidebarOpen && <div className="da-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`da-sidebar ${isSidebarOpen ? 'da-sidebar--open' : ''}`}>
        {/* Admin info */}
        <div className="da-sidebar__profile">
          <div className="da-sidebar__avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt="Admin" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <span>{adminInitial}</span>
            )}
          </div>
          <div className="da-sidebar__profile-info">
            <span className="da-sidebar__name">{adminName}</span>
            <span className="da-sidebar__role-label">Administrador</span>
            <span className="da-sidebar__badge">Admin</span>
          </div>
        </div>

        {/* Primary nav */}
        <nav className="da-sidebar__nav">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`da-nav-btn ${activeTab === id ? 'da-nav-btn--active' : ''}`}
              onClick={() => handleTabChange(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Back to Home */}
        <nav className="da-sidebar__nav da-sidebar__nav--secondary">
          <hr className="da-sidebar__divider" />
          <Link to="/" className="da-nav-btn">
            <Home size={18} />
            <span>Volver a Inicio</span>
          </Link>
        </nav>

        {/* Branding footer */}
        <div className="da-sidebar__footer">
          <div className="da-sidebar__brand-logo">
            <Dumbbell size={20} />
            <span>Power <strong>FIT</strong></span>
          </div>
          <p>Plataforma inteligente para llevar tu entrenamiento al siguiente nivel.</p>
        </div>
      </aside>

      {/* ── Main wrapper ── */}
      <div className="da-main">


        {/* Content */}
        <main className="da-content">
          {renderContent()}
        </main>
      </div>

      {/* ── Add Exercise Modal ── */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)} style={{ zIndex: 2000 }}>
          <div className="modal-content admin-exercise-modal animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header-premium">
              <h2>Agregar Nuevo Ejercicio</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateExercise} className="admin-form-premium">
              <div className="form-group-admin">
                <label>Nombre del Ejercicio</label>
                <input type="text" required placeholder="Ej: Press de Banca Plano"
                  value={newExercise.nombre} onChange={e => setNewExercise({ ...newExercise, nombre: e.target.value })} />
              </div>
              <div className="form-row-admin">
                <div className="form-group-admin">
                  <label>Categoría</label>
                  <select value={newExercise.categoria} onChange={e => setNewExercise({ ...newExercise, categoria: e.target.value })}>
                    {['Pecho','Espalda','Piernas','Hombros','Brazos','Core','Glúteos'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group-admin">
                  <label>Nivel de Dificultad</label>
                  <select value={newExercise.nivel} onChange={e => setNewExercise({ ...newExercise, nivel: e.target.value })}>
                    <option value="PRINCIPIANTE">Principiante</option>
                    <option value="INTERMEDIO">Intermedio</option>
                    <option value="AVANZADO">Avanzado</option>
                    <option value="EXPERTO">Experto</option>
                  </select>
                </div>
              </div>
              <div className="form-row-admin">
                <div className="form-group-admin">
                  <label>Músculo</label>
                  <input type="text" placeholder="Ej: PECHO" required
                    value={newExercise.musculo} onChange={e => setNewExercise({ ...newExercise, musculo: e.target.value })} />
                </div>
                <div className="form-group-admin">
                  <label>Tiempo</label>
                  <input type="text" placeholder="Ej: 45 SEG" required
                    value={newExercise.tiempo} onChange={e => setNewExercise({ ...newExercise, tiempo: e.target.value })} />
                </div>
              </div>
              <div className="form-group-admin">
                <label>URL de Imagen Ilustrativa</label>
                <div className="input-icon-wrapper">
                  <ImageIcon size={18} />
                  <input type="url" required placeholder="https://images.unsplash.com/..."
                    value={newExercise.imagen} onChange={e => setNewExercise({ ...newExercise, imagen: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-submit-admin" disabled={processing}>
                {processing ? 'Agregando...' : <><Plus size={20} />Agregar Ejercicio</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashAdmin;
