import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { sendMessage } from '../Services/Chatbot';
import { updateUser } from '../Services/userService';
import { parseInlineMarkdown, renderMarkdown } from '../utils/markdownParser';
import {
  PlusSquare, Settings, User, LayoutDashboard, MessageSquare,
  Dumbbell, Apple, Clock, CheckCircle, Activity, Utensils,
  BarChart2, Paperclip, Send, Flame, Footprints, Heart, Moon, Menu, X,
  Save
} from 'lucide-react';
import Swal from 'sweetalert2';
import '../styles/Chatbot.css';


const ChatComponent = () => {
  const { user, refreshUser } = useContext(UserContext);
  const [inputText, setInputText] = useState('');
  const [savedRoutineIdx, setSavedRoutineIdx] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: '¡Hola! Soy tu asistente de salud impulsado por IA. He revisado tus datos de actividad recientes. Has completado 3 entrenamientos esta semana y la calidad de tu sueño ha mejorado en un 12%.\n\n¿Cómo puedo apoyar tus metas de fitness hoy?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [historialChat, setHistorialChat] = useState(() => {
    const saved = localStorage.getItem("historialChatFitness");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: 'bot',
        content: '¡Hola! Soy tu asistente de salud impulsado por IA.\n\n¿Cómo puedo apoyar tus metas de fitness hoy?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setCurrentChatId(null);
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

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const perfilFitness = JSON.parse(localStorage.getItem("perfilFitness") || "{}");
      const nivel = perfilFitness.nivel || user?.nivel || "No especificado";
      const objetivo = perfilFitness.objetivo || user?.objetivo || "No especificado";

      const contextoUsuario = `El usuario tiene un nivel ${nivel} y su objetivo es ${objetivo}. Adapta todas las recomendaciones a este perfil.`;

      const reply = await sendMessage(updatedMessages, contextoUsuario);
      
      const newBotMessage = {
        role: 'bot',
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, newBotMessage];
      setMessages(finalMessages);

      // Guardar en el historial
      setHistorialChat((prev) => {
        let nuevoHistorial = [...prev];
        let targetChatId = currentChatId;
        
        if (!targetChatId) {
          targetChatId = Date.now();
          setCurrentChatId(targetChatId);
          const nuevoChat = {
            id: targetChatId,
            title: text,
            messages: finalMessages,
            fecha: new Date().toISOString()
          };
          nuevoHistorial = [nuevoChat, ...nuevoHistorial].slice(0, 20);
        } else {
          const chatIndex = nuevoHistorial.findIndex(c => c.id === targetChatId);
          if (chatIndex > -1) {
            nuevoHistorial[chatIndex] = {
              ...nuevoHistorial[chatIndex],
              messages: finalMessages,
              fecha: new Date().toISOString()
            };
          }
        }
        
        localStorage.setItem("historialChatFitness", JSON.stringify(nuevoHistorial));
        return nuevoHistorial;
      });

    } catch (error) {
      console.error("Error sending message:", error);
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
      {/* Checkbox Hack for Mobile Sidebar */}
      <input type="checkbox" id="sidebar-toggle" className="sidebar-toggle-input" style={{ display: 'none' }} />
      
      {/* Mobile Sidebar Overlay */}
      <label htmlFor="sidebar-toggle" className="sidebar-overlay-label">
        <div className="sidebar-overlay"></div>
      </label>

      {/* Main Layout Area */}
      <div className="chatbot-body">

        {/* Left Sidebar */}
        <aside className="chatbot-sidebar-left">
          <div className="mobile-sidebar-header">
            <span>Historial de Chats</span>
            <label htmlFor="sidebar-toggle" className="close-sidebar-btn">
              <X size={24} />
            </label>
          </div>

          <div className="new-chat-btn-container" style={{ paddingBottom: '16px', borderBottom: '1px solid #2d1b1c', marginBottom: '16px' }}>
            <button
              onClick={handleNewChat}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#7c2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <PlusSquare size={18} /> Nuevo Chat
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Historial Reciente</div>
            {historialChat.length > 0 ? (
              historialChat.map((chat) => (
                <div 
                  key={chat.id} 
                  className="nav-item"
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setMessages(chat.messages || []);
                  }}
                  title={chat.title || chat.pregunta}
                >
                  <MessageSquare size={18} /> 
                  <span style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    maxWidth: '180px'
                  }}>
                    {chat.title || chat.pregunta}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '8px 12px', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                No hay chats previos
              </div>
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="chatbot-main">
          {/* Mobile Chat Header with Hamburger */}
          <div className="mobile-chat-header">
            <label htmlFor="sidebar-toggle" className="mobile-menu-toggle">
              <Menu size={24} />
            </label>
            <span className="mobile-bot-name">VitalBot Assist</span>
          </div>

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
                      <div className="md-content">
                        {renderMarkdown(msg.content)}
                      </div>
                      {/* Botón Guardar Rutina – solo si el mensaje parece contener una rutina */}
                      {/rutina|entrenamiento|ejercicio|series|repeticion/i.test(msg.content) && (
                        <button
                          className="btn-save-routine"
                          disabled={savedRoutineIdx === idx}
                          onClick={async () => {
                            if (!user?.id) return;
                            try {
                              const updated = await updateUser(user.id, { rutina_ia: msg.content });
                              refreshUser(updated);
                              setSavedRoutineIdx(idx);
                              Swal.fire({
                                icon: 'success',
                                title: '¡Rutina Guardada!',
                                text: 'Puedes verla en tu apartado de Entrenamientos.',
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000,
                                background: '#171212',
                                color: '#fff'
                              });
                            } catch (err) {
                              console.error('Error saving routine:', err);
                              Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'No se pudo guardar la rutina.',
                                background: '#171212',
                                color: '#fff',
                                confirmButtonColor: '#8b0000'
                              });
                            }
                          }}
                        >
                          <Save size={14} />
                          {savedRoutineIdx === idx ? 'Rutina Guardada ✓' : 'Guardar esta Rutina'}
                        </button>
                      )}
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
      </div>
    </div>
  );
};

export default ChatComponent;

