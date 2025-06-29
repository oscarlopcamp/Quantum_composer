import sys
import os

# Fuerza la ruta base del proyecto como parte del PYTHONPATH
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from gui.ventana_principal import mostrar_ventana

if __name__ == "__main__":
    mostrar_ventana()
