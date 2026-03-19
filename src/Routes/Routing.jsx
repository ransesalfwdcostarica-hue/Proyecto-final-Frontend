import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from '../Pages/Home';
import Contacto from '../Pages/Contacto';
import Login from '../Pages/Login';
import Registro from '../Pages/Registro';
import Chatbot from '../Pages/Chatbot';
import DashboardAdmin from '../Pages/DashboardAdmin';
import DashboardCliente from '../Pages/DashboardCliente';
import Testimonios from '../Pages/Testimonios';
import PerfilUsuario from '../Pages/PerfilUsuario';

const Routing = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/dietas" element={<Dietas />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/plan" element={<div style={{ paddingTop: '100px', textAlign: 'center' }}><h2>Elige tu Plan</h2></div>} />
                <Route path="/admin" element={<DashboardAdmin />} />
                <Route path="/dashboard" element={<DashboardCliente />} />
                <Route path="/comunidad" element={<Testimonios />} />
                <Route path="/perfil/:id" element={<PerfilUsuario />} />
            </Routes>
        </Router>
    );
};

export default Routing;
