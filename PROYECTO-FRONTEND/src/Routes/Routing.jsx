import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Contacto from '../pages/Contacto';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import PerfilSalud from '../pages/PerfilSalud';
import FormFisic from '../components/FormFisic';
import MetaUsuario from '../components/MetaUsuario';

const Routing = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contacto" element={<Contacto />} />
                {/* Placeholder routes to prevent 404s when navigating */}
                <Route path="/dietas" element={<div style={{ paddingTop: '100px', textAlign: 'center' }}><h2>Sección de Dietas en construcción</h2></div>} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/perfil-salud" element={<PerfilSalud />} />
                <Route path="/meta-usuario" element={<MetaUsuario />} />
                <Route path="/plan" element={<div style={{ paddingTop: '100px', textAlign: 'center' }}><h2>Elige tu Plan</h2></div>} />
            </Routes>
        </Router>
    );
};

export default Routing;
