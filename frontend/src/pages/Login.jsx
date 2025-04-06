import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import useAuth from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value});
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Si no es "Admin", validar que el correo contenga "@"
    if (credentials.email !== "Admin" && !credentials.email.includes('@')) {
      alert("Ingrese un correo válido o 'Admin' para login de administrador.");
      return;
    }

    // Caso especial para el usuario Admin
    if (credentials.email === "Admin" && credentials.password === "ouaisdfhb9asyc7") {
      login("Admin", true);
      setCredentials({ email: "", password: "" });
      alert("Inicio de sesión exitoso como administrador.");
      navigate("/");
      return;
    }

    // Login para usuarios no Admin mediante el backend
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (response.ok) {
        // Se usa el email como nombre de usuario en este ejemplo
        login(credentials.email, false);
        setCredentials({ email: "", password: "" });
        alert("Inicio de sesión exitoso");
        navigate("/");
      } else {
        alert("Error: " + data.detail);
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="login fadeIn">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Correo: </label>
          <input 
            type="text" 
            name="email" 
            value={credentials.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Contraseña: </label>
          <input 
            type="password" 
            name="password" 
            value={credentials.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;
