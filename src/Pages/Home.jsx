import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="glass-card" style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <h1 className="title" style={{ margin: 0, fontSize: '1.5rem' }}>
          {user.rol === "admin" ? "Panel de Administrador" : "Panel de Usuario"}
        </h1>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.nombre}</p>
          <button 
            onClick={handleLogout}
            className="form-button" 
            style={{ padding: '0.4rem 0.8rem', marginTop: '0.5rem', background: 'rgba(248, 113, 113, 0.2)', border: '1px solid #f87171', color: '#f87171', fontSize: '0.8rem' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {user.rol === "admin" && (
          <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '1.5rem', borderRadius: '15px', border: '1px solid rgba(79, 70, 229, 0.3)' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Gestión de Usuarios</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Acceso exclusivo para administradores para gestionar cuentas.</p>
          </div>
        )}
        
        <div style={{ background: 'var(--input-bg)', padding: '1.5rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Perfil</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Gestiona tu información personal y preferencias.</p>
        </div>
        
        <div style={{ background: 'var(--input-bg)', padding: '1.5rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Actividad</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Revisa tus últimos movimientos y estadísticas.</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '15px', border: '1px solid rgba(79, 70, 229, 0.3)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>¡Bienvenido {user.nombre}!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {user.rol === "admin" 
            ? "Tienes privilegios elevados. Puedes ver herramientas administrativas arriba."
            : "Estamos contentos de verte. Este es tu espacio personal donde puedes controlar todo lo relacionado con tu cuenta."}
        </p>
      </div>
    </div>
  );
}

export default Home;
