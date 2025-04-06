# app/routes/auth.py
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.database import mongo

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Validación de campos obligatorios
    required_fields = ['nombre', 'apellido', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Falta el campo {field}'}), 400

    # Verifica si el usuario ya existe
    if mongo.db.RegistroUsuario.find_one({'email': data['email']}):
        return jsonify({'error': 'El usuario ya existe'}), 400

    # Hashear la contraseña
    hashed_password = generate_password_hash(data['password'])
    user = {
        'nombre': data['nombre'],
        'apellido': data['apellido'],
        'email': data['email'],
        'password': hashed_password
    }

    mongo.db.RegistroUsuario.insert_one(user)
    return jsonify({'message': 'Usuario registrado exitosamente'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = mongo.db.RegistroUsuario.find_one({'email': data.get('email')})
    if user and check_password_hash(user['password'], data.get('password')):
        # Aquí se recomienda generar un token (por ejemplo, JWT) para la sesión
        return jsonify({'message': 'Inicio de sesión exitoso'}), 200
    return jsonify({'error': 'Credenciales incorrectas'}), 401
