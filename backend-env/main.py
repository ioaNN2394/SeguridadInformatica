from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from pydantic import BaseModel, EmailStr, constr
from passlib.context import CryptContext

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

# Contexto para hashear contraseñas usando bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Modelos Pydantic para validar entradas

class UserRegister(BaseModel):
    nombre: constr(strip_whitespace=True, min_length=1)
    apellido: constr(strip_whitespace=True, min_length=1)
    email: EmailStr
    password: constr(min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: constr(min_length=8)

class FormData(BaseModel):
    nombre: constr(strip_whitespace=True, min_length=1)
    apellido: constr(strip_whitespace=True, min_length=1)
    celular: constr(strip_whitespace=True, min_length=1)
    cedula: constr(strip_whitespace=True, min_length=1)
    correo: EmailStr
    nacimiento: constr(strip_whitespace=True, min_length=1)

# Función auxiliar para sanitizar la entrada (evita claves que empiecen con '$')
def sanitize_input(data: dict):
    for key in data.keys():
        if key.startswith('$'):
            raise HTTPException(status_code=400, detail="Clave de entrada inválida detectada.")
    return data

@app.get("/")
async def root():
    return {"message": "Backend corriendo correctamente"}

@app.post("/auth/login")
async def login(credentials: UserLogin):
    # Sanitizar la entrada
    creds = sanitize_input(credentials.dict())
    user = db.RegistroUsuario.find_one({"email": creds.get("email")})
    if user:
        # Verificar contraseña hasheada
        if pwd_context.verify(creds.get("password"), user.get("password")):
            return {"message": "Inicio de sesión exitoso"}
        else:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
    raise HTTPException(status_code=401, detail="Credenciales inválidas")

@app.post("/auth/register")
async def register(user: UserRegister):
    # Sanitizar la entrada
    user_data = sanitize_input(user.dict())
    if db.RegistroUsuario.find_one({"email": user_data.get("email")}):
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    # Hashear la contraseña antes de almacenarla
    user_data['password'] = pwd_context.hash(user_data['password'])
    db.RegistroUsuario.insert_one(user_data)
    return {"message": "Usuario registrado exitosamente"}

@app.post("/form/submit")
async def submit_form(form_data: FormData):
    # Sanitizar la entrada
    data = sanitize_input(form_data.dict())
    db.RegistroFormulario.insert_one(data)
    return {"message": "Formulario enviado exitosamente"}

@app.get("/form/list")
async def list_forms():
    forms = list(db.RegistroFormulario.find())
    for form in forms:
        form['_id'] = str(form['_id'])
    return forms

@app.put("/form/update/{form_id}")
async def update_form(form_id: str, form_data: FormData):
    # Sanitizar la entrada
    data = sanitize_input(form_data.dict())
    result = db.RegistroFormulario.update_one({"_id": ObjectId(form_id)}, {"$set": data})
    if result.modified_count:
        return {"message": "Formulario actualizado exitosamente"}
    raise HTTPException(status_code=404, detail="Formulario no encontrado")

@app.delete("/form/delete/{form_id}")
async def delete_form(form_id: str):
    result = db.RegistroFormulario.delete_one({"_id": ObjectId(form_id)})
    if result.deleted_count:
        return {"message": "Formulario eliminado exitosamente"}
    raise HTTPException(status_code=404, detail="Formulario no encontrado")
