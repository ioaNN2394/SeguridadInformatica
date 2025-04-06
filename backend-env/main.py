# SeguridadInformatica/backend-env/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

app = FastAPI()

# Configuración de CORS: Permite peticiones desde http://localhost:5173
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión a la base de datos MongoDB
MONGO_URI = os.getenv(
    "MONGO_URI", 
    "mongodb+srv://Seguro2025:bgJbp7rjiOAug8gD@security.ikz5zh5.mongodb.net/securityDB?retryWrites=true&w=majority"
)
client = MongoClient(MONGO_URI)
db = client.securityDB

@app.get("/")
async def root():
    return {"message": "Backend corriendo correctamente"}

@app.post("/auth/login")
async def login(credentials: dict):
    user = db.RegistroUsuario.find_one({"email": credentials.get("email")})
    if user:
        # Aquí se debería validar la contraseña con hash, etc.
        return {"message": "Inicio de sesión exitoso"}
    raise HTTPException(status_code=401, detail="Credenciales inválidas")

@app.post("/auth/register")
async def register(user: dict):
    if db.RegistroUsuario.find_one({"email": user.get("email")}):
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    db.RegistroUsuario.insert_one(user)
    return {"message": "Usuario registrado exitosamente"}

@app.post("/form/submit")
async def submit_form(formData: dict):
    required_fields = ['nombre', 'apellido', 'celular', 'cedula', 'correo', 'nacimiento']
    for field in required_fields:
        if field not in formData:
            raise HTTPException(status_code=400, detail=f"Falta el campo {field}")
    db.RegistroFormulario.insert_one(formData)
    return {"message": "Formulario enviado exitosamente"}

@app.get("/form/list")
async def list_forms():
    forms = list(db.RegistroFormulario.find())
    for form in forms:
        form['_id'] = str(form['_id'])
    return forms

@app.put("/form/update/{form_id}")
async def update_form(form_id: str, formData: dict):
    # Eliminar el campo _id si está presente para evitar modificarlo
    if "_id" in formData:
        del formData["_id"]
    result = db.RegistroFormulario.update_one({"_id": ObjectId(form_id)}, {"$set": formData})
    if result.modified_count:
        return {"message": "Formulario actualizado exitosamente"}
    raise HTTPException(status_code=404, detail="Formulario no encontrado")

@app.delete("/form/delete/{form_id}")
async def delete_form(form_id: str):
    result = db.RegistroFormulario.delete_one({"_id": ObjectId(form_id)})
    if result.deleted_count:
        return {"message": "Formulario eliminado exitosamente"}
    raise HTTPException(status_code=404, detail="Formulario no encontrado")
