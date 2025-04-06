# app/__init__.py
from flask import Flask
from .config import Config
from .database import mongo

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializa la base de datos
    mongo.init_app(app)

    # Registro de blueprints para modularizar las rutas
    from .routes.auth import auth_bp
    from .routes.form import form_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(form_bp, url_prefix='/form')

    return app
