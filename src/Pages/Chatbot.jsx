import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusSquare, Settings, User, LayoutDashboard, MessageSquare, 
  Dumbbell, Apple, Clock, CheckCircle, Activity, Utensils,
  BarChart2, Paperclip, Send, Flame, Footprints, Heart, Moon
} from 'lucide-react';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [inputText, setInputText] = useState('');

  return (
    <div className="chatbot-wrapper">
      {/* Header */}
      <header className="chatbot-header">
        <Link to="/" className="chatbot-logo-area">
     
            <PlusSquare size={20} />
          <span>Power <span style={{color: '#ca4a4a'}}>Fit Asistente</span></span>
        </Link>
        
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
          <div className="sidebar-section">
            <div className="sidebar-title">MENÚ</div>
            <Link to="/panel" className="nav-item">
              <LayoutDashboard size={20} /> Panel de Control
            </Link>
            <div className="nav-item active">
              <MessageSquare size={20} /> IA VitalBot
            </div>
            <Link to="/plan" className="nav-item">
              <Dumbbell size={20} /> Entrenamientos
            </Link>
            <Link to="/dietas" className="nav-item">
              <Apple size={20} /> Nutrición
            </Link>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">SESIONES RECIENTES</div>
            <div className="nav-item-small">
              <Clock size={16} /> Recuperación de Rodilla
            </div>
            <div className="nav-item-small">
              <Clock size={16} /> Preparación de Dieta Keto
            </div>
          </div>

          <div className="upgrade-card">
            <h3>Mejora a Pro</h3>
            <p>Obtén entrenamiento por IA y planes de dieta personalizados ilimitados.</p>
            <button className="btn-white">Explorar Planes</button>
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
                    <p style={{marginTop: '16px'}}>¿Cómo puedo apoyar tus metas de fitness hoy?</p>
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
                    <p style={{marginTop: '16px', fontWeight: 'bold'}}>Basado en tu condición prexistente, te sugiero:</p>
                    
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
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => {
                   if(e.key === 'Enter') {
                     setInputText('');
                   }
                 }}
               />
               <button className="send-btn" onClick={() => setInputText('')}>
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

          <div className="sidebar-title" style={{marginLeft: 0, marginBottom: '16px'}}>ESTADÍSTICAS DE HOY</div>
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

export default Chatbot;