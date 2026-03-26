import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser } from '../Services/userService';
import { Trash2, UserPlus, AlertTriangle, X, Edit2, Save } from 'lucide-react';
import { getAllUsers, deleteUser, updateUser } from '../services/userService';
import { Trash2, UserPlus, AlertTriangle, X, Edit2, Save, Eye, Activity, ClipboardList, Target, Calendar, User as UserIcon } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    email: '',
    rol: '',
    edad: ''
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (userId) => {
    setUserIdToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      nombre: user.nombre || '',
      email: user.email || '',
      rol: user.rol || 'cliente',
      edad: user.edad || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, editForm);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u));
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      alert("Error al actualizar usuario");
    }
  };

  const handleOpenDetail = (user) => {
    setDetailUser(user);
    setIsDetailModalOpen(true);
  };

  const calculateWeightLost = (user) => {
    if (!user.peso || !user.pesoActual) return 0;
    const inicio = parseFloat(user.peso);
    const actual = parseFloat(user.pesoActual);
    return (inicio - actual).toFixed(1);
  };

  const confirmDeleteUser = async () => {
    if (!userIdToDelete) return;

    try {
      await deleteUser(userIdToDelete);
      setUsers(users.filter(u => u.id !== userIdToDelete));
      setIsDeleteModalOpen(false);
      setUserIdToDelete(null);
    } catch (error) {
      alert("Error al eliminar usuario");
    }
  };

  return (
    <div className="admin-panel animate-fade-in">
      <div className="dashboard-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra los usuarios registrados en la plataforma</p>
      </div>

      <div className="panel-header">
        <h2>Lista de Usuarios</h2>
        <button className="btn-primary" onClick={() => window.location.href = '/registro'}>
          <UserPlus size={18} />
          Agregar Usuario
        </button>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Edad</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>{user.edad}</td>
                  <td>
                    <span className={`badge ${user.rol}`}>
                      {user.rol === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn-action edit"
                        onClick={() => handleEdit(user)}
                        title="Editar usuario"
                      >
                        <Edit2 size={18} />
                      </button>
                      {user.rol !== 'admin' && (
                        <button
                          className="btn-view-progress"
                          onClick={() => handleOpenDetail(user)}
                        >
                          Ver progreso del usuario
                        </button>
                      )}
                      <button
                        className="btn-action delete"
                        onClick={() => handleDelete(user.id)}
                        title="Eliminar usuario"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de edición de usuario */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '650px', width: '90%', textAlign: 'left' }}>
            <div className="modal-header">
              <h2>Editar Usuario</h2>
              <button className="btn-close" onClick={() => setIsEditModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="story-form">
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Edad</label>
                  <input
                    type="number"
                    value={editForm.edad}
                    onChange={(e) => setEditForm({ ...editForm, edad: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select
                    value={editForm.rol}
                    onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
                    required
                  >
                    <option value="cliente">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">
                  <Save size={18} />
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal animate-fade-in">
            <div className="confirm-icon-container">
              <AlertTriangle size={48} color="#ff4d4d" />
            </div>
            <h3>¿Eliminar Usuario?</h3>
            <p>Esta acción es irreversible y el usuario perderá el acceso a la plataforma permanentemente.</p>
            <div className="modal-actions-column">
              <button className="btn-cancel-full" onClick={() => setIsDeleteModalOpen(false)}>No, Mantener Usuario</button>
              <button className="btn-delete-full" onClick={confirmDeleteUser}>Sí, Eliminar Usuario</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles de progreso y perfil */}
      {isDetailModalOpen && detailUser && (
        <div className="modal-overlay">
          <div className="modal-content admin-detail-modal animate-fade-in" style={{ maxWidth: '800px', width: '95%', textAlign: 'left' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="detail-avatar">
                  <img src={detailUser.avatar || `https://i.pravatar.cc/150?u=${detailUser.id}`} alt={detailUser.nombre} />
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>{detailUser.nombre}</h2>
                  <p style={{ margin: 0, color: '#a0a0a0', fontSize: '0.9rem' }}>{detailUser.email}</p>
                </div>
              </div>
              <button className="btn-close" onClick={() => setIsDetailModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="admin-detail-body">
              <div className="admin-detail-grid">
                {/* Columna 1: Información Física */}
                <div className="detail-section">
                  <h3><UserIcon size={20} color="#ff4d4d" /> Información Física</h3>
                  <div className="detail-info-list">
                    <div className="detail-item">
                      <span>Edad:</span> <strong>{detailUser.edad} años</strong>
                    </div>
                    <div className="detail-item">
                      <span>Estatura:</span> <strong>{detailUser.altura} cm</strong>
                    </div>
                    <div className="detail-item">
                      <span>Sexo:</span> <strong>{detailUser.sexo === 'm' ? 'Masculino' : 'Femenino'}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Alergias:</span> <strong style={{ color: (detailUser.alergias?.toLowerCase() === 'no' || detailUser.alergias?.toLowerCase() === 'ninguna' ? '#4ade80' : '#ff4d4d') }}>{detailUser.alergias || 'Ninguna'}</strong>
                    </div>
                  </div>
                </div>

                {/* Columna 2: Plan y Meta */}
                <div className="detail-section">
                  <h3><Target size={20} color="#ff4d4d" /> Plan y Objetivos</h3>
                  <div className="detail-info-list">
                    <div className="detail-item">
                      <span>Peso Inicial:</span> <strong>{detailUser.peso} kg</strong>
                    </div>
                    <div className="detail-item">
                      <span>Peso Meta:</span> <strong>{detailUser.pesoMeta} kg</strong>
                    </div>
                    <div className="detail-item">
                      <span>Plazo Semanas:</span> <strong>{detailUser.plazoSemanas} semanas</strong>
                    </div>
                  </div>
                </div>

                {/* Columna 3: Progreso Actual */}
                <div className="detail-section full-width">
                  <h3><Activity size={20} color="#ff4d4d" /> Avance del Programa</h3>
                  <div className="progress-highlights">
                    <div className="highlight-card maroon">
                      <span className="label">Peso Actual</span>
                      <span className="value">{detailUser.pesoActual || detailUser.peso} kg</span>
                    </div>
                    <div className="highlight-card dark">
                      <span className="label">Peso Perdido</span>
                      <span className="value">{calculateWeightLost(detailUser)} kg</span>
                    </div>
                    <div className="highlight-card dark">
                      <span className="label">Semana de Progreso</span>
                      <span className="value">{detailUser.semanasEnProgreso || 0} / {detailUser.plazoSemanas}</span>
                    </div>
                  </div>
                </div>

                {/* Columna 4: Feedback Reciente */}
                <div className="detail-section full-width feedback-section">
                  <h3><ClipboardList size={20} color="#ff4d4d" /> Último Feedback del Cliente</h3>
                  <div className="feedback-grid-admin">
                    <div className="feedback-box">
                      <label>Sobre la Dieta:</label>
                      <p>{detailUser.ultimoFeedbackDieta || "Sin feedback registrado aún."}</p>
                    </div>
                    <div className="feedback-box">
                      <label>Sobre el Ejercicio:</label>
                      <p>{detailUser.ultimoFeedbackEjercicio || "Sin feedback registrado aún."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
              <button type="button" className="btn-cancel" onClick={() => setIsDetailModalOpen(false)}>Cerrar Detalles</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
