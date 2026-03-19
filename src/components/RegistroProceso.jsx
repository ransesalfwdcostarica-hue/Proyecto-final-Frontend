import { useState } from "react";
import FormRegistro from "./FormRegistro";
import FormFisic from "./FormFisic";
import MetaUsuario from "./MetaUsuario";
import "../Styles/Login.css";

function RegistroProceso() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    nombre: "",
    edad: "",
    rol: "",
    // Step 2 data
    edadFisica: "",
    sexo: "",
    altura: "",
    peso: "",
    lugarEntrenamiento: "",
    alergias: "",
    // Step 3 data
    pesoMeta: 70.0,
    plazoSemanas: 8
  });

  const nextStep = (newData) => {
    setUserData((prev) => ({ ...prev, ...newData }));
    setStep((prev) => prev + 1);
  };

  const prevStep = (newData) => {
    setUserData((prev) => ({ ...prev, ...newData }));
    setStep((prev) => prev - 1);
  };

  return (
    <div className="login-page-container">
      {step === 1 ? (
        <div className="auth-split-card">
          <div className="auth-image-side" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop')" }}>
            <div className="auth-image-overlay">
              <h2>Eleva tu<br /><span>Rendimiento</span></h2>
              <p>Únete a miles de atletas que hacen seguimiento de sus medidas y alcanzan nuevas metas cada día.</p>
            </div>
          </div>
          <div className="auth-form-side" style={{ overflowY: 'auto', display: 'block', padding: '2rem' }}>
            <FormRegistro 
              userData={userData} 
              onNext={nextStep} 
            />
          </div>
        </div>
      ) : (
        <div className="registration-full-container fade-in">
          {step === 2 && (
            <FormFisic 
              userData={userData} 
              onNext={nextStep} 
              onBack={prevStep} 
            />
          )}
          {step === 3 && (
            <MetaUsuario 
              userData={userData} 
              onBack={prevStep} 
            />
          )}
        </div>
      )}
    </div>
  );
}

export default RegistroProceso;
