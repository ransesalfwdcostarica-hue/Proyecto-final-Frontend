import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { sendMessage } from '../Services/Chatbot';
import {
  PlusSquare, Settings, User, LayoutDashboard, MessageSquare,
  Dumbbell, Apple, Clock, CheckCircle, Activity, Utensils,
  BarChart2, Paperclip, Send, Flame, Footprints, Heart, Moon
} from 'lucide-react';
import '../styles/Chatbot.css';

const ChatComponent = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: '¡Hola! Soy tu asistente de salud impulsado por IA. He revisado tus datos de actividad recientes. Has completado 3 entrenamientos esta semana y la calidad de tu sueño ha mejorado en un 12%.\n\n¿Cómo puedo apoyar tus metas de fitness hoy?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;
    
    const newUserMessage = {
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const reply = await sendMessage(newUserMessage.content);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: 'Lo siento, hubo un error al procesar tu solicitud.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Header */}
      <header className="chatbot-header">
        <Link to="/" className="chatbot-logo-area">

          <PlusSquare size={20} />
          <span>Power <span style={{ color: '#ca4a4a' }}>Fit Asistente</span></span>
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
