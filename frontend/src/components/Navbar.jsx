import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import useAuth from '../hooks/useAuth';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInternalNavigation = (e, id) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
    } else {
      scrollToSection(id);
    }
  };

  const handleLogout = () => {
    logout();
    alert("Sesión cerrada correctamente.");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <a href="#inicio" onClick={(e) => handleInternalNavigation(e, 'inicio')}>Inicio</a>
      <a href="#quienes-somos" onClick={(e) => handleInternalNavigation(e, 'quienes-somos')}>Quienes Somos</a>
      <a href="#contactanos" onClick={(e) => handleInternalNavigation(e, 'contactanos')}>Contáctanos</a>
      <a href="#formulario" onClick={(e) => handleInternalNavigation(e, 'formulario')}>Formulario</a>
      
      {user ? (
        <>
          <span className="user-info">Bienvenido, {user.userName}</span>
          <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/registro">Registro</Link>
        </>
      )}

      {user && user.isAdmin && <Link to="/formularios">Formularios</Link>}
    </nav>
  );
}

export default Navbar;
