// SeguridadInformatica/frontend/src/pages/Formularios.jsx
import { useEffect, useState } from 'react';
import '../styles/formularios.css';

function Formularios() {
  const [forms, setForms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/form/list');
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms: ", error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("¿Está seguro que desea eliminar este formulario?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/form/delete/${id}`, { method: 'DELETE' });
        if(response.ok) {
          alert("Formulario eliminado exitosamente");
          fetchForms();
        } else {
          const data = await response.json();
          alert("Error: " + data.detail);
        }
      } catch (error) {
        console.error("Error deleting form: ", error);
      }
    }
  };

  const handleUpdate = (form) => {
    setSelectedForm(form);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedForm(null);
  };

  const handleModalChange = (e) => {
    setSelectedForm({ ...selectedForm, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/form/update/${selectedForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedForm)
      });
      if(response.ok) {
        alert("Formulario actualizado exitosamente");
        handleModalClose();
        fetchForms();
      } else {
        const data = await response.json();
        alert("Error: " + data.detail);
      }
    } catch(error) {
      console.error("Error updating form: ", error);
    }
  };

  return (
    <div className="formularios-page">
      <h2>Gestión de Formularios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Celular</th>
            <th>Cédula</th>
            <th>Correo</th>
            <th>Fecha de Nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {forms.map(form => (
            <tr key={form._id}>
              <td>{form.nombre}</td>
              <td>{form.apellido}</td>
              <td>{form.celular}</td>
              <td>{form.cedula}</td>
              <td>{form.correo}</td>
              <td>{form.nacimiento}</td>
              <td>
                <button onClick={() => handleUpdate(form)}>Actualizar</button>
                <button onClick={() => handleDelete(form._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h3>Actualizar Formulario</h3>
            <form onSubmit={handleModalSubmit}>
              <label>Nombre:</label>
              <input type="text" name="nombre" value={selectedForm.nombre} onChange={handleModalChange} required />
              <label>Apellido:</label>
              <input type="text" name="apellido" value={selectedForm.apellido} onChange={handleModalChange} required />
              <label>Celular:</label>
              <input type="text" name="celular" value={selectedForm.celular} onChange={handleModalChange} required />
              <label>Cédula:</label>
              <input type="text" name="cedula" value={selectedForm.cedula} onChange={handleModalChange} required />
              <label>Correo:</label>
              <input type="email" name="correo" value={selectedForm.correo} onChange={handleModalChange} required />
              <label>Fecha de Nacimiento:</label>
              <input type="date" name="nacimiento" value={selectedForm.nacimiento} onChange={handleModalChange} required />
              <button type="submit">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Formularios;
