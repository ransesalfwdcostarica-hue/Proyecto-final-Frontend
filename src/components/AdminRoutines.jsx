import React, { useState, useEffect } from 'react';
import { getAllRoutines, updateRoutineStatus, deleteRoutine } from '../services/routineService';
import { Check, X, Trash2 } from 'lucide-react';

const AdminRoutines = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    try {
      setLoading(true);
      const data = await getAllRoutines();
      setRoutines(data);
    } catch (error) {
      console.error("Error loading routines", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (routineId, newStatus) => {
    try {
      const updated = await updateRoutineStatus(routineId, newStatus);
      setRoutines(routines.map(r => r.id === routineId ? updated : r));
    } catch {
      alert("Error al actualizar la rutina");
    }
  };

  const handleDelete = async (routineId) => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta rutina de forma permanente?')) {
      try {
        await deleteRoutine(routineId);
        setRoutines(routines.filter(r => r.id !== routineId));
      } catch {
        alert("Error al eliminar la rutina");
      }
    }
  };

  const filteredRoutines = routines.filter(r => filter === 'all' ? true : r.status === filter);

  return (
    <div className="admin-panel animate-fade-in">
      <div className="dashboard-header">
        <h1>Moderación de Rutinas</h1>
        <p>Revisa y modera las rutinas creadas por los usuarios</p>
      </div>

      <div className="panel-header" style={{display: 'flex', gap: '1rem', justifyContent: 'flex-start'}}>
        <button 
          className={`filter-btn ${filter === 'all' ? 'active all' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active pending' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pendientes
        </button>
        <button 
          className={`filter-btn ${filter === 'approved' ? 'active approved' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Aprobadas
        </button>
        <button 
          className={`filter-btn ${filter === 'rejected' ? 'active rejected' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rechazadas
        </button>
      </div>

      {loading ? (
        <p>Cargando rutinas...</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título / Detalle</th>
                <th>Usuario (ID)</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutines.map(routine => (
                <tr key={routine.id}>
                  <td>
                    <strong>{routine.title || `Rutina #${routine.id}`}</strong>
                    <br/>
                    <span style={{fontSize: '0.8rem', color: '#a3aed1'}}>{routine.description || 'Sin descripción'}</span>
                  </td>
                  <td>{routine.userId || 'Desconocido'}</td>
                  <td>{routine.date || 'Sin fecha'}</td>
                  <td>
                    <span className={`badge ${routine.status || 'pending'}`}>
                      {routine.status === 'approved' ? 'Aprobada' : routine.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      {routine.status !== 'approved' && (
                        <button 
                          className="btn-action approve"
                          onClick={() => handleStatusChange(routine.id, 'approved')}
                          title="Aprobar"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      {routine.status !== 'rejected' && (
                        <button 
                          className="btn-action reject"
                          onClick={() => handleStatusChange(routine.id, 'rejected')}
                          title="Rechazar"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <button 
                        className="btn-action delete"
                        onClick={() => handleDelete(routine.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRoutines.length === 0 && (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>
                    No se encontraron rutinas en esta categoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRoutines;
