import FormRegistro from "../components/FormRegistro";
import "../styles/Login.css";

function Registro() {
  return (
    <div className="login-page-container">
      <div className="auth-split-card">
        <div className="auth-image-side" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop')" }}>
          <div className="auth-image-overlay">
            <h2>Eleva tu<br /><span>Rendimiento</span></h2>
            <p>Únete a miles de atletas que hacen seguimiento de sus medidas y alcanzan nuevas metas cada día.</p>
          </div>
        </div>
        <div className="auth-form-side">
          <FormRegistro />
        </div>
      </div>
    </div>
  );
}

export default Registro;
