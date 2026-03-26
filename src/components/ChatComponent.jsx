import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusSquare, Settings, User, LayoutDashboard, MessageSquare,
  Dumbbell, Apple, Clock, CheckCircle, Activity, Utensils,
  BarChart2, Paperclip, Send, Flame, Footprints, Heart, Moon, Menu, X
} from 'lucide-react';
import '../styles/Chatbot.css';

const ChatComponent = () => {
  return (
    <div className="chatbot-wrapper">
      {/* Mobile Sidebar Overlay */}
      <div className="sidebar-overlay" style={{ display: 'none' }}></div>

      {/* Header */}
      <header className="chatbot-header">
        <div className="header-left-mobile">
          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
          <Link to="/" className="chatbot-logo-area">
            <PlusSquare size={20} />
            <span className="logo-text">Power <span style={{ color: '#ca4a4a' }}>Fit Asistente</span></span>
          </Link>
        </div>

        <div className="header-right">
          <div className="system-status">
            <div className="status-dot"></div>
            SISTEMA ACTIVO
          </div>
          <button className="header-icon-btn"><Settings size={20} /></button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="chatbot-body">

        {/* Left Sidebar */}
        <aside className="chatbot-sidebar-left">
          <div className="mobile-sidebar-header">
            <span>Historial de Chats</span>
            <button className="close-sidebar-btn">
              <X size={24} />
            </button>
          </div>

          <div className="new-chat-btn-container" style={{ paddingBottom: '16px', borderBottom: '1px solid #2d1b1c', marginBottom: '16px' }}>
            <button
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#7c2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <PlusSquare size={18} /> Nuevo Chat
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Hoy</div>
            <div className="nav-item active">
              <MessageSquare size={18} /> Análisis de Estadísticas
            </div>
            <div className="nav-item">
              <MessageSquare size={18} /> Recuperación de Rodilla
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Ayer</div>
            <div className="nav-item">
              <MessageSquare size={18} /> Preparación de Dieta Keto
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Últimos 7 Días</div>
            <div className="nav-item">
              <MessageSquare size={18} /> Rutina HIIT 30 min
            </div>
            <div className="nav-item">
              <MessageSquare size={18} /> Suplementación deportiva
            </div>
            <div className="nav-item">
              <MessageSquare size={18} /> Calcular macros
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="chatbot-main">
          <div className="chat-messages">
            {/* Bot Message 1 */}
            <div className="msg-row">
              <div className="msg-avatar">
                <PlusSquare size={20} color="white" />
              </div>
              <div className="msg-content">
                <div className="msg-header">
                  <span className="msg-name">VitalBot</span>
                  <span className="msg-time">09:41 AM</span>
                </div>
                <div className="msg-bubble bot-bubble">
                  <p>¡Hola! Soy tu asistente de salud impulsado por IA. He revisado tus datos de actividad recientes. Has completado 3 entrenamientos esta semana y la calidad de tu sueño ha mejorado en un 12%.</p>
                  <p style={{ marginTop: '16px' }}>¿Cómo puedo apoyar tus metas de fitness hoy?</p>
                </div>
              </div>
            </div>

            {/* User Message */}
            <div className="msg-row user-row">
              <div className="msg-avatar user-avatar-sm">
                <User size={20} />
              </div>
              <div className="msg-content">
                <div className="msg-header user-header">
                  <span className="msg-time">09:42 AM</span>
                  <span className="msg-name">Tú</span>
                </div>
              </div>
            </div>

            {/* Bot Message 2 */}
            <div className="msg-row">
              <div className="msg-avatar">
                <PlusSquare size={20} color="white" />
              </div>
              <div className="msg-content">
                <div className="msg-header">
                  <span className="msg-name">VitalBot</span>
                  <span className="msg-time">09:42 AM</span>
                </div>
                <div className="msg-bubble bot-bubble">
                  <p>El dolor en la parte baja de la espalda es común, pero debemos priorizar la recuperación para evitar lesiones. Te recomiendo ajustar tu sesión de hoy.</p>
                  <p style={{ marginTop: '16px', fontWeight: 'bold' }}>Basado en tu condición prexistente, te sugiero:</p>

                  <div className="suggestion-list">
                    <div className="suggestion-item">
                      <CheckCircle size={20} className="suggestion-icon" />
                      30 minutos de Cardio Constante de Baja Intensidad (LISS)
                    </div>
                    <div className="suggestion-item">
                      <CheckCircle size={20} className="suggestion-icon" />
                      Rutina de movilidad enfocada en los flexores de la cadera y el cuadrado lumbar
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="chat-input-container">
            <div className="action-chips">
              <div className="action-chip"><Dumbbell size={16} /> Sugerir un entrenamiento</div>
              <div className="action-chip"><Utensils size={16} /> Calcular mis macros</div>
              <div className="action-chip"><Activity size={16} /> Sesión de movilidad</div>
              <div className="action-chip"><BarChart2 size={16} /> Analizar mis estadísticas</div>
            </div>

            <div className="input-box-wrapper">
              <button className="attach-btn"><Paperclip size={20} /></button>
              <input
                type="text"
                className="chat-input"
                placeholder="Pregúntale a VitalBot lo que sea..."
              />
              <button className="send-btn">
                <Send size={18} />
              </button>
            </div>
            <div className="disclaimer">
              VitalBot puede cometer errores. Verifica siempre la información de salud importante con un profesional.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatComponent;

