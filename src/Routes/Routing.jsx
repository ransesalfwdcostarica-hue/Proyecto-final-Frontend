import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Inicio from "../Pages/Inicio";
import Login from "../Pages/Login";
import Registro from "../Pages/Registro";
import Home from "../Pages/Home";

function Routing() {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Inicio/>}/>
                <Route path="/Inicio" element={<Inicio/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/registro" element={<Registro/>}/>
                <Route path="/home" element={<Home/>}/>
            </Routes>
        </Router>
    )
}
export default Routing;