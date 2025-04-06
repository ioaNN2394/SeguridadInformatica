import { useState } from 'react';
import '../styles/formulario.css';

function Formulario() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    celular: '',
    cedula: '',
    correo: '',
    nacimiento: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/form/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Formulario enviado exitosamente');
      } else {
        alert('Error: ' + data.detail);
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Error en la conexión con el servidor');
    }
  };

  return (
    <div className="formulario fadeIn">
      <h2>Formulario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre: </label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div>
          <label>Apellido: </label>
          <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
        </div>
        <div>
          <label>Celular: </label>
          <input type="tel" name="celular" value={formData.celular} onChange={handleChange} required />
        </div>
        <div>
          <label>Cédula: </label>
          <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} required />
        </div>
        <div>
          <label>Correo: </label>
          <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
        </div>
        <div>
          <label>Fecha de Nacimiento: </label>
          <input type="date" name="nacimiento" value={formData.nacimiento} onChange={handleChange} required />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Formulario;
