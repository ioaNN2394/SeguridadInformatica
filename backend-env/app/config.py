# app/config.py
import os
from dotenv import load_dotenv

load_dotenv()  # Carga las variables definidas en el archivo .env

class Config:
    MONGO_URI = os.getenv('MONGO_URI')
