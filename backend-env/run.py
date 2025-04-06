# run.py
from app import create_app

app = create_app()

if __name__ == '__main__':
    # En producción, asegúrate de no usar debug=True
    app.run(debug=False)
