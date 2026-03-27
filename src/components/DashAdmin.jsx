import React, { useState } from 'react';
import { LayoutDashboard, Users, Activity, Home, Dumbbell, Mail, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardAdministrador from './DashboardAdministrador';
import AdminUsers from './AdminUsers';
import AdminRoutines from './AdminRoutines';
import AdminExercises from './AdminExercises';
import { crearEjercicio } from '../services/exerciseService';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import AdminMessages from './AdminMessages';
import '../styles/dashboard.css';

const DashAdmin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };
  const [newExercise, setNewExercise] = useState({
    nombre: '',
    nivel: 'PRINCIPIANTE',
    musculo: '',
    tiempo: '',
    imagen: '',
    categoria: 'Pecho'
  });

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    try {
      await crearEjercicio(newExercise);
      setShowAddModal(false);
      setNewExercise({
        nombre: '',
        nivel: 'PRINCIPIANTE',
        musculo: '',
        tiempo: '',
        imagen: '',
        categoria: 'Pecho'
      });

      // Trigger refresh in other components
      window.dispatchEvent(new CustomEvent('refreshExercises'));

      Swal.fire({
        title: '¡Éxito!',
        text: 'El ejercicio ha sido agregado a la biblioteca.',
        icon: 'success',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000'
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo agregar el ejercicio.',
        icon: 'error',
        background: '#171212',
        color: '#fff',
        confirmButtonColor: '#8b0000'
      });
    }
  };

  const renderContent = () => {
    const openAddModal = () => setShowAddModal(true);

    switch (activeTab) {
      case 'overview':
        return <DashboardAdministrador changeTab={setActiveTab} openAddModal={openAddModal} />;
      case 'users':
        return <AdminUsers />;
      case 'routines':
        return <AdminRoutines />;
      case 'exercises':
        return <AdminExercises openAddModal={openAddModal} />;
      case 'messages':
        return <AdminMessages />;
      default:
        return <DashboardAdministrador changeTab={setActiveTab} openAddModal={openAddModal} />;
    }
  };

  return (
    <div className="admin-dashboard">
      {isMobileMenuOpen && (
        <div className="admin-mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`} style={{ zIndex: 1000 }}>
        <button className="admin-mobile-close" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={24} />
        </button>
        <h2>Admin Panel</h2>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <LayoutDashboard size={20} />
            Overview
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            <Users size={20} />
            Usuarios
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'routines' ? 'active' : ''}`}
            onClick={() => handleTabChange('routines')}
          >
            <Activity size={20} />
            Rutinas
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => handleTabChange('messages')}
          >
            <Mail size={20} />
            Mensajes
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'exercises' ? 'active' : ''}`}
            onClick={() => handleTabChange('exercises')}
          >
            <Dumbbell size={20} />
            Ejercicios
          </button>
          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e9edff' }} />
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="sidebar-btn">
              <Home size={20} />
              Volver a Inicio
            </button>
          </Link>
        </nav>
      </aside>

      <main className="admin-content">
        <div className="admin-mobile-header">
          <button className="admin-mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
        {renderContent()}
      </main>

      {/* Global Add Exercise Modal */}
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
                <input
                  type="text"
                  required
                  placeholder="Ej: Press de Banca Plano"
                  value={newExercise.nombre}
                  onChange={e => setNewExercise({ ...newExercise, nombre: e.target.value })}
                />
              </div>
              <div className="form-row-admin">
                <div className="form-group-admin">
                  <label>Categoría</label>
                  <select
                    value={newExercise.categoria}
                    onChange={e => setNewExercise({ ...newExercise, categoria: e.target.value })}
                  >
                    <option value="Pecho">Pecho</option>
                    <option value="Espalda">Espalda</option>
                    <option value="Piernas">Piernas</option>
                    <option value="Hombros">Hombros</option>
                    <option value="Brazos">Brazos</option>
                    <option value="Core">Core</option>
                    <option value="Glúteos">Glúteos</option>
                  </select>
                </div>
                <div className="form-group-admin">
                  <label>Nivel de Dificultad</label>
                  <select
                    value={newExercise.nivel}
                    onChange={e => setNewExercise({ ...newExercise, nivel: e.target.value })}
                  >
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
                  <input
                    type="text"
                    placeholder="Ej: PECHO"
                    required
                    value={newExercise.musculo}
                    onChange={e => setNewExercise({ ...newExercise, musculo: e.target.value })}
                  />
                </div>
                <div className="form-group-admin">
                  <label>Tiempo</label>
                  <input
                    type="text"
                    placeholder="Ej: 45 SEG"
                    required
                    value={newExercise.tiempo}
                    onChange={e => setNewExercise({ ...newExercise, tiempo: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group-admin">
                <label>URL de Imagen Ilustrativa</label>
                <div className="input-icon-wrapper">
                  <ImageIcon size={18} />
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newExercise.imagen}
                    onChange={e => setNewExercise({ ...newExercise, imagen: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn-submit-admin">
                <Plus size={20} />
                Agregar Ejercicio
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashAdmin;
