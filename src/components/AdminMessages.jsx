import React, { useState, useEffect } from 'react';
import { getAllContactMessages, deleteContactMessage } from '../services/userService';
import { Trash2, Mail, Calendar, User, Phone, MapPin } from 'lucide-react';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getAllContactMessages();
      // Sort by date descending (assuming 'fecha' exists)
      const sortedData = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setMessages(sortedData);
    } catch (error) {
      console.error("Error loading messages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContactMessage(id);
      setMessages(messages.filter(m => m.id !== id));
    } catch {
      alert("Error al eliminar el mensaje");
    }
  };

  return (
    <div className="admin-panel animate-fade-in">
      <div className="dashboard-header">
        <h1>Gestión de Mensajes</h1>
        <p>Revisa y administra los mensajes enviados a través del formulario de contacto</p>
      </div>

      {loading ? (
        <p>Cargando mensajes...</p>
      ) : (
        <div className="messages-grid">
          {messages.map(message => (
            <div key={message.id} className="message-card">
              <div className="message-header">
                <div className="message-user-info">
                  <User size={20} className="text-primary" />
                  <h3>{message.nombre}</h3>
                </div>
                <button 
                  className="btn-delete-small"
                  onClick={() => handleDelete(message.id)}
                  title="Eliminar mensaje"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="message-details">
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{message.email}</span>
                </div>
                {message.contacto && (
                  <div className="detail-item">
                    <Phone size={16} />
                    <span>{message.contacto}</span>
                  </div>
                )}
                {message.pais && (
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{message.pais}</span>
                  </div>
                )}
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{new Date(message.fecha).toLocaleString()}</span>
                </div>
              </div>

              <div className="message-body">
                <p>{message.mensaje}</p>
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="no-messages">
              <Mail size={48} opacity={0.3} />
              <p>No hay mensajes nuevos.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
