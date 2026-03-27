import React, { useState, useEffect } from 'react';
import '../Styles/MotivationalQuote.css';

const quotes = [
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "No te detengas hasta que estés orgulloso.",
  "El único entrenamiento malo es el que no ocurrió.",
  "Tu cuerpo puede aguantar casi cualquier cosa. Es a tu mente a la que tienes que convencer.",
  "La disciplina es el puente entre las metas y los logros.",
  "Si buscas resultados distintos, no hagas siempre lo mismo.",
  "El dolor es temporal, el orgullo es para siempre.",
  "No cuentes los días, haz que los días cuenten.",
  "Cree en ti mismo y serás imparable.",
  "La única persona a la que debes intentar superar es a la que fuiste ayer.",
  "Cada paso cuenta para llegar a la cima.",
  "Convierte tus debilidades en fortalezas."
];

const MotivationalQuote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  const changeQuote = () => {
    const currentIndex = quotes.indexOf(quote);
    let nextIndex = Math.floor(Math.random() * quotes.length);
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * quotes.length);
    }
    setQuote(quotes[nextIndex]);
  };

  return (
    <div className="motivational-quote-container" onClick={changeQuote} aria-label="Cambiar frase motivadora">
      <div className="quote-content">
        <div className="quote-icon">⚡</div>
        <p className="quote-text">"{quote}"</p>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>Haz clic para obtener más motivación</span>
      </div>
    </div>
  );
};

export default MotivationalQuote;
