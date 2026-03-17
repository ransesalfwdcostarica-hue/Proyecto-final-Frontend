import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../services/userService';
import { Trash2, UserPlus, AlertTriangle, X } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

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
        <button className="btn-primary" onClick={() => window.location.href='/registro'}>
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
                  <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
    </div>
  );
};

export default AdminUsers;
