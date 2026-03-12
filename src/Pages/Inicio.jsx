import { Link } from "react-router-dom";

function Inicio() {
  return (
    <div className="full-screen-center" style={{ flexDirection: 'column' }}>
      {/* Minimal Navigation */}
      <nav className="navbar" style={{ background: 'transparent', border: 'none', backdropFilter: 'none' }}>
        <div className="logo" style={{ fontSize: '1.2rem', fontWeight: '800' }}>
          ASTRA<span style={{ color: 'var(--primary)' }}>UI</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/login" className="nav-link">Ingresar</Link>
          <Link to="/registro" className="form-button" style={{ marginTop: 0, padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>
            Registro
          </Link>
        </div>
      </nav>

      {/* Simplified Hero Card */}
      <div className="glass-card" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Bienvenido a <span style={{ color: 'var(--primary)' }}>AstraUI</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
          La forma más simple y elegante de gestionar tus proyectos. 
          Diseñado para la velocidad, construido para ti.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/registro" className="form-button" style={{ textDecoration: 'none', padding: '0.8rem 2rem' }}>
            Comenzar ahora
          </Link>
          <Link to="/login" className="form-button" style={{ 
            textDecoration: 'none', 
            padding: '0.8rem 2rem', 
            background: 'var(--glass-bg)', 
            border: '1px solid var(--glass-border)' 
          }}>
            Ver Demo
          </Link>
        </div>
      </div>

      <footer style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        © 2026 AstraUI. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default Inicio;
