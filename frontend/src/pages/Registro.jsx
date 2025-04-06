import { useState } from 'react';
import '../styles/registro.css';

function Registro() {
  const [user, setUser] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();

    // Validar que la contraseña tenga al menos 8 caracteres
    if (user.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registro exitoso');
      } else {
        alert('Error: ' + JSON.stringify(data.detail));
      }
    } catch (error) {
      console.error('Error en registro:', error);
      alert('Error en la conexión con el servidor');
    }
  };

  return (
    <div className="registro fadeIn">
      <h1>Registro</h1>
      <form onSubmit={handleRegistro}>
        <div>
          <label>Nombre: </label>
          <input type="text" name="nombre" value={user.nombre} onChange={handleChange} required />
        </div>
        <div>
          <label>Apellido: </label>
          <input type="text" name="apellido" value={user.apellido} onChange={handleChange} required />
        </div>
        <div>
          <label>Correo: </label>
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Contraseña: </label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registro;
