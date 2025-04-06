# app/routes/form.py
from flask import Blueprint, request, jsonify
from app.database import mongo

form_bp = Blueprint('form_bp', __name__)

@form_bp.route('/submit', methods=['POST'])
def submit_form():
    data = request.get_json()
    required_fields = ['nombre', 'apellido', 'celular', 'cedula', 'correo', 'nacimiento']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Falta el campo {field}'}), 400

    mongo.db.RegistroFormulario.insert_one(data)
    return jsonify({'message': 'Formulario enviado exitosamente'}), 201
