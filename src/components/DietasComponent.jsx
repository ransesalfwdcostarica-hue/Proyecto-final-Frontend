import React, { useState } from 'react';
import { Apple, Scale, Target, Activity, ChevronRight, Info, Utensils, Flame } from 'lucide-react';
import '../Styles/Dietas.css';

const DietasComponent = () => {
    const [formData, setFormData] = useState({
        currentWeight: '',
        goalWeight: '',
        height: '',
        age: '',
        gender: 'male',
        activityLevel: 'moderate',
        dietPreference: 'balanced',
        goals: []
    });

    const categories = [
        { id: 'balanced', name: 'Balanceada', icon: <Utensils size={20} />, desc: 'Proteínas, carbohidratos y grasas en equilibrio.' },
        { id: 'keto', name: 'Keto / Low Carb', icon: <Flame size={20} />, desc: 'Alta en grasas saludables, muy baja en carbohidratos.' },
        { id: 'vegetarian', name: 'Vegetariana', icon: <Apple size={20} />, desc: 'Enfocada en fuentes de proteína vegetal.' },
        { id: 'muscle', name: 'Ganancia Pro', icon: <Activity size={20} />, desc: 'Alta en proteína para hipertrofia.' }
    ];

    return (
        <div className="dietas-page">
            <div className="dietas-container">
                {/* Header Section */}
                <header className="dietas-header animate-fade-in">
                    <div className="dietas-badge">
                        <Apple size={16} />
                        <span>Nutrición Inteligente</span>
                    </div>
                    <h1>Tu Plan de Alimentación</h1>
                    <p className="dietas-subtitle">
                        Diseñamos una estrategia nutricional basada en tu biometría y objetivos únicos. Empieza hoy tu transformación.
                    </p>
                </header>

                <div className="dietas-layout">
                    {/* Form Section */}
                    <main className="dietas-main">
                        <div className="form-card animate-slide-up">
                            <div className="form-section">
                                <h3 className="section-title">
                                    <Scale size={20} />
                                    <span>Datos Biométricos</span>
                                </h3>
                                <div className="inputs-grid">
                                    <div className="input-group">
                                        <label>Peso Actual (kg)</label>
                                        <input type="number" placeholder="Ej: 75" />
                                    </div>
                                    <div className="input-group">
                                        <label>Peso Meta (kg)</label>
                                        <input type="number" placeholder="Ej: 70" />
                                    </div>
                                    <div className="input-group">
                                        <label>Altura (cm)</label>
                                        <input type="number" placeholder="Ej: 175" />
                                    </div>
                                    <div className="input-group">
                                        <label>Edad</label>
                                        <input type="number" placeholder="Ej: 25" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">
                                    <Utensils size={20} />
                                    <span>Preferencia Dietética</span>
                                </h3>
                                <div className="category-grid">
                                    {categories.map(cat => (
                                        <div 
                                            key={cat.id} 
                                            className={`category-card ${formData.dietPreference === cat.id ? 'active' : ''}`}
                                            onClick={() => setFormData({...formData, dietPreference: cat.id})}
                                        >
                                            <div className="cat-icon">{cat.icon}</div>
                                            <div className="cat-info">
                                                <h4>{cat.name}</h4>
                                                <p>{cat.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">
                                    <Activity size={20} />
                                    <span>Nivel de Actividad</span>
                                </h3>
                                <div className="activity-options">
                                    <select className="premium-select">
                                        <option value="sedentary">Sedentario (Poco o nada de ejercicio)</option>
                                        <option value="light">Ligero (1-2 días/semana)</option>
                                        <option value="moderate" selected>Moderado (3-5 días/semana)</option>
                                        <option value="intense">Intenso (6-7 días/semana)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-footer">
                                <div className="info-notice">
                                    <Info size={16} />
                                    <span>Usamos esta información para calcular tus macros exactos.</span>
                                </div>
                                <button className="btn-generate-plan">
                                    <span>Generar mi Plan</span>
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </main>

                    {/* Sidebar / Info Section */}
                    <aside className="dietas-sidebar">
                        <div className="info-card animate-fade-in-right">
                            <div className="target-icon">
                                <Target size={40} />
                            </div>
                            <h3>¿Por qué un plan personalizado?</h3>
                            <p>
                                Cada metabolismo es diferente. Un plan genérico puede funcionar por un tiempo, pero uno adaptado a tu actividad y metas garantiza resultados sostenibles.
                            </p>
                            <ul className="benefits-list">
                                <li>Déficit calórico calculado</li>
                                <li>Distribución de macros óptima</li>
                                <li>Sugerencias de comidas</li>
                            </ul>
                        </div>

                        <div className="status-card">
                            <div className="status-header">
                                <Activity size={18} />
                                <span>Estimación inicial</span>
                            </div>
                            <div className="status-main">
                                <span className="status-label">Meta saludable</span>
                                <span className="status-value">-0.5kg / semana</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default DietasComponent;
