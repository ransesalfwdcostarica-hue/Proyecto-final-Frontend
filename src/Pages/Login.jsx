import FormLogin from "../components/FormLogin";
import "../styles/Login.css";

function Login() {
  return (
    <div className="login-page-container">
      <div className="auth-split-card">
        <div className="auth-image-side" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop')" }}>
          <div className="auth-image-overlay">
            <h2>Eleva tu<br /><span>Rendimiento</span></h2>
            <p>Únete a miles de atletas que hacen seguimiento de sus medidas y alcanzan nuevas metas cada día.</p>
          </div>
        </div>
        <div className="auth-form-side">
          <FormLogin />
        </div>
      </div>
    </div>
  );
}

export default Login;
