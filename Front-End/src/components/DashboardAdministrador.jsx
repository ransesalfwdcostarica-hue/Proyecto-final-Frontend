import React, { useEffect, useState, useContext } from 'react';
import {
  Dumbbell, Users, Mail, BarChart2, ChevronRight, Plus, Dumbbell as DumbbellIcon, Play, X
} from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { getAllUsers, getAllContactMessages } from '../Services/userService';
import { getAllRoutines } from '../Services/routineService';
import { obtenerTodosEjercicios } from '../Services/exerciseService';
import { getAllReports } from '../Services/testimonioService';

const DashboardAdministrador = ({ changeTab, openAddModal }) => {
  const { user } = useContext(UserContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoutines: 0,
    pendingRoutines: 0,
    approvedRoutines: 0,
    totalExercises: 0,
    totalMessages: 0,
    totalReports: 0,
  });
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  const adminName = user?.nombre || user?.email?.split('@')[0] || 'admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, routines, exercises, messages, reports] = await Promise.all([
          getAllUsers().catch(err => { console.error('Error fetching users:', err); return []; }),
          getAllRoutines().catch(err => { console.error('Error fetching routines:', err); return []; }),
          obtenerTodosEjercicios().catch(err => { console.error('Error fetching exercises:', err); return []; }),
          getAllContactMessages().catch(err => { console.error('Error fetching messages:', err); return []; }),
          getAllReports().catch(err => { console.error('Error fetching reports:', err); return []; }),
        ]);
        const pending = routines.filter(r => r.status === 'pending').length;
        const approved = routines.filter(r => r.status === 'approved').length;
        setStats({
          totalUsers: users.length,
          totalRoutines: routines.length,
          pendingRoutines: pending,
          approvedRoutines: approved,
          totalExercises: exercises.length,
          totalMessages: messages.length,
          totalReports: reports.length,
        });
        setExercises(exercises);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const handleRefresh = () => fetchStats();
    window.addEventListener('refreshExercises', handleRefresh);
    return () => window.removeEventListener('refreshExercises', handleRefresh);
  }, []);

  const statCards = [
    {
      label: 'Total Ejercicios',
      value: stats.totalExercises,
      sub: 'En la biblioteca',
      icon: Dumbbell,
      tab: 'exercises',
      color: 'red',
    },
    {
      label: 'Usuarios Activos',
      value: stats.totalUsers,
      sub: 'Registrados',
      icon: Users,
      tab: 'users',
      color: 'blue',
    },
    {
      label: 'Mensajes Nuevos',
      value: stats.totalMessages,
      sub: 'Sin leer',
      icon: Mail,
      tab: 'messages',
      color: 'teal',
    },
    {
      label: 'Reportes',
      value: stats.totalReports,
      sub: 'Generados',
      icon: BarChart2,
      tab: 'reports',
      color: 'purple',
    },
  ];

  return (
    <div className="dao-root animate-fade-in">
      {/* Welcome Banner */}
      <div className="dao-welcome">
        <div className="dao-welcome__text">
          <h1>¡Bienvenido de vuelta, {adminName}! 👋</h1>
          <p>Aquí tienes un resumen general de tu plataforma.</p>
        </div>
        <div className="dao-welcome__dumbbell" aria-hidden="true">
          <Dumbbell size={96} strokeWidth={1.2} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="dao-stats">
        {statCards.map(({ label, value, sub, icon: Icon, tab, color }) => (
          <button
            key={tab}
            className={`dao-stat-card dao-stat-card--${color}`}
            onClick={() => changeTab(tab)}
          >
            <div className={`dao-stat-card__icon dao-stat-card__icon--${color}`}>
              <Icon size={22} />
            </div>
            <div className="dao-stat-card__body">
              <span className="dao-stat-card__label">{label}</span>
              <span className="dao-stat-card__value">{value}</span>
              <span className="dao-stat-card__sub">{sub}</span>
            </div>
            <ChevronRight className="dao-stat-card__arrow" size={18} />
          </button>
        ))}
      </div>

      {/* Exercises section */}
      <div className="dao-section">
        <div className="dao-section__header">
          <div className="dao-section__title-wrap">
            <div className="dao-section__title-icon">
              <Dumbbell size={20} />
            </div>
            <div>
              <h2>Gestión de Ejercicios</h2>
              <p>Administra la biblioteca de movimientos y rutinas.</p>
            </div>
          </div>
        </div>

        {/* Mini search bar + filter row */}
        <div className="dao-section__filters">
          <div className="dao-search-box">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input 
                type="text" 
                placeholder="Buscar por nombre o categoría..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="dao-filter-select" onClick={() => changeTab('exercises')}>
            Todas las categorías
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <button className="dao-filter-btn" onClick={() => changeTab('exercises')}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" x2="20" y1="6" y2="6"/><line x1="8" x2="16" y1="12" y2="12"/><line x1="11" x2="13" y1="18" y2="18"/></svg>
            Filtros
          </button>
        </div>

        {/* Table header */}
        <div className="dao-table-header">
          {['Miniatura', 'Nombre', 'Categoría', 'Músculo principal', 'Nivel', 'Acciones'].map(h => (
            <span key={h}>{h}</span>
          ))}
        </div>

        {/* Exercise List */}
        <div className="dao-exercise-list">
            {exercises
                .filter(ex => 
                    ex.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    ex.categoria.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, 10) // Show only first 10 in overview
                .map(ex => (
                    <div key={ex.id} className="dao-table-row">
                        <div className="dao-col-thumb">
                            <img src={ex.imagen} alt="" />
                        </div>
                        <div className="dao-col-name">
                            <strong>{ex.nombre}</strong>
                        </div>
                        <div className="dao-col-cat">
                            <span className="dao-badge">{ex.categoria}</span>
                        </div>
                        <div className="dao-col-muscle">
                            {ex.musculo}
                        </div>
                        <div className="dao-col-lvl">
                            <span className={`dao-lvl-tag dao-lvl-${ex.nivel.toLowerCase()}`}>{ex.nivel}</span>
                        </div>
                        <div className="dao-col-actions">
                            <button className="dao-action-btn" onClick={() => setSelectedTechnique(ex)} title="Ver técnica">
                                <Play size={16} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>

        {/* Empty state (only if no exercises at all) */}
        {exercises.length === 0 && (
            <div className="dao-empty-state">
              <Dumbbell size={48} strokeWidth={1} />
              <p>No se encontraron ejercicios</p>
              <span>Aún no hay ejercicios en la biblioteca.</span>
            </div>
        )}
      </div>

      <TechniqueModal exercise={selectedTechnique} onClose={() => setSelectedTechnique(null)} />
    </div>
  );
};

/* Técnica Modal Helper Component (Local to this file to avoid conflicts) */
const TechniqueModal = ({ exercise, onClose }) => {
    if (!exercise) return null;
    return (
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
        <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '0', overflow: 'hidden', textAlign: 'left' }}>
          <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'white' }}>Técnica: {exercise.nombre}</h2>
            <button className="close-btn" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={24} /></button>
          </div>
          <div className="modal-body" style={{ padding: '0' }}>
            {exercise.videoUrl ? (
              <div className="video-responsive">
                <iframe 
                  width="100%" 
                  height="350" 
                  src={exercise.videoUrl} 
                  title={exercise.nombre}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 40px', color: '#555' }}>
                <DumbbellIcon size={64} style={{ opacity: 0.1, marginBottom: '20px' }} />
                <p>El video de técnica para este ejercicio aún no está disponible.</p>
              </div>
            )}
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Músculo Principal</span>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: 'white' }}>{exercise.musculo}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Nivel de Dificultad</span>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: 'white' }}>{exercise.nivel}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default DashboardAdministrador;
