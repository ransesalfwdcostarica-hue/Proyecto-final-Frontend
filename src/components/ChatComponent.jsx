import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { sendMessage } from '../Services/Chatbot';
import {
  PlusSquare, Settings, User, LayoutDashboard, MessageSquare,
  Dumbbell, Apple, Clock, CheckCircle, Activity, Utensils,
  BarChart2, Paperclip, Send, Flame, Footprints, Heart, Moon, Menu, X
} from 'lucide-react';
import '../styles/Chatbot.css';

const ChatComponent = () => {
  const [inputText, setInputText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="chatbot-wrapper">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Header */}
      <header className="chatbot-header">
        <div className="header-left-mobile">
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
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
        <aside className={`chatbot-sidebar-left ${isSidebarOpen ? 'mobile-open' : ''}`}>
          <div className="mobile-sidebar-header">
            <span>Historial de Chats</span>
            <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
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
            {messages.map((msg, idx) => (
              <div key={idx} className={`msg-row ${msg.role === 'user' ? 'user-row' : ''}`}>
                <div className={`msg-avatar ${msg.role === 'user' ? 'user-avatar-sm' : ''}`}>
                  {msg.role === 'user' ? <User size={20} /> : <PlusSquare size={20} color="white" />}
                </div>
                <div className="msg-content">
                  <div className={`msg-header ${msg.role === 'user' ? 'user-header' : ''}`}>
                    {msg.role === 'bot' && <span className="msg-name">VitalBot</span>}
                    <span className="msg-time">{msg.time}</span>
                    {msg.role === 'user' && <span className="msg-name">Tú</span>}
                  </div>
                  {msg.role === 'bot' ? (
                    <div className="msg-bubble bot-bubble">
                      <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                    </div>
                  ) : (
                    <div className="msg-bubble user-bubble">
                      <p>{msg.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="msg-row">
                <div className="msg-avatar">
                  <PlusSquare size={20} color="white" />
                </div>
                <div className="msg-content">
                  <div className="msg-header">
                    <span className="msg-name">VitalBot</span>
                  </div>
                  <div className="msg-bubble bot-bubble">
                    <p>Escribiendo...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <div className="action-chips">
              <div className="action-chip" onClick={() => handleSendMessage('Sugerir un entrenamiento')}><Dumbbell size={16} /> Sugerir un entrenamiento</div>
              <div className="action-chip" onClick={() => handleSendMessage('Calcular mis macros')}><Utensils size={16} /> Calcular mis macros</div>
              <div className="action-chip" onClick={() => handleSendMessage('Sesión de movilidad')}><Activity size={16} /> Sesión de movilidad</div>
              <div className="action-chip" onClick={() => handleSendMessage('Analizar mis estadísticas')}><BarChart2 size={16} /> Analizar mis estadísticas</div>
            </div>

            <div className="input-box-wrapper">
              <button className="attach-btn"><Paperclip size={20} /></button>
              <input
                type="text"
                className="chat-input"
                placeholder="Pregúntale a VitalBot lo que sea..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <button className="send-btn" onClick={() => handleSendMessage()}>
                <Send size={18} />
              </button>
            </div>
            <div className="disclaimer">
              VitalBot puede cometer errores. Verifica siempre la información de salud importante con un profesional.
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="chatbot-sidebar-right">
          <div className="right-section-title">
            <BarChart2 size={20} color="#ca4a4a" /> Salud en Tiempo Real
          </div>

          <div className="score-card">
            <div className="score-header">
              <span>Puntuación de Actividad</span>
              <span className="score-value">84/100</span>
            </div>
            <div className="score-bar-bg">
              <div className="score-bar-fill"></div>
            </div>
          </div>

          <div className="sidebar-title" style={{ marginLeft: 0, marginBottom: '16px' }}>ESTADÍSTICAS DE HOY</div>
          <div className="stats-grid">
            <div className="stat-box">
              <Flame size={20} className="stat-icon" />
              <div className="stat-label">Calorías</div>
              <div className="stat-value">1,420</div>
            </div>
            <div className="stat-box">
              <Footprints size={20} className="stat-icon" />
              <div className="stat-label">Pasos</div>
              <div className="stat-value">8,432</div>
            </div>
            <div className="stat-box">
              <Heart size={20} className="stat-icon" />
              <div className="stat-label">Ritmo Card.</div>
              <div className="stat-value">72 bpm</div>
            </div>
            <div className="stat-box">
              <Moon size={20} className="stat-icon" />
              <div className="stat-label">Sueño</div>
              <div className="stat-value">7h 20m</div>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default ChatComponent;
