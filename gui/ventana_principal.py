from PyQt5.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout, QLabel
)
import sys
from quantum.simulador import SimuladorQubit
from quantum.visual import generar_imagen_circuito, generar_resultado
from gui.componentes.barra_botones import BarraBotones
from gui.componentes.vista_circuito import VistaCircuito
from gui.componentes.vista_resultado import VistaResultado

def mostrar_ventana():
    app = QApplication(sys.argv)
    ventana = VentanaPrincipal()
    ventana.show()
    sys.exit(app.exec_())

class VentanaPrincipal(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Quantum Composer Local")
        self.setGeometry(200, 200, 1100, 800)

        self.simulador = SimuladorQubit(num_qubits=1)
        generar_imagen_circuito(self.simulador.qc)
        generar_resultado(self.simulador)

        # Widgets visuales
        self.vista_circuito = VistaCircuito()
        self.vista_resultado = VistaResultado()
        self.barra = BarraBotones(self.simulador, self.vista_circuito, self.vista_resultado)

        # Encabezados
        label_circuito = QLabel("📐 Circuito generado")
        label_resultado = QLabel("📊 Resultado cuántico")

        # Estilo para encabezados
        label_circuito.setStyleSheet("font-weight: bold; font-size: 16px; margin-bottom: 6px;")
        label_resultado.setStyleSheet("font-weight: bold; font-size: 16px; margin: 12px 0 6px 0;")

        # Layout circuito
        layout_circuito = QVBoxLayout()
        layout_circuito.addWidget(label_circuito)
        layout_circuito.addWidget(self.vista_circuito)

        # Layout superior: barra izquierda + circuito a la derecha
        layout_superior = QHBoxLayout()
        layout_superior.addWidget(self.barra)
        layout_superior.addLayout(layout_circuito)

        # Layout general
        layout_general = QVBoxLayout()
        layout_general.addLayout(layout_superior)
        layout_general.addWidget(label_resultado)
        layout_general.addWidget(self.vista_resultado)

        self.setLayout(layout_general)

        # 🎨 Estilo general académico
        self.setStyleSheet("""
            QWidget {
                background-color: #f5f5f5;
                font-family: 'Segoe UI', sans-serif;
                font-size: 14px;
            }

            QPushButton {
                background-color: #ffffff;
                border: 1px solid #cccccc;
                border-radius: 8px;
                padding: 8px 12px;
            }

            QPushButton:hover {
                background-color: #e0e0e0;
            }

            QPushButton:pressed {
                background-color: #d5d5d5;
            }
        """)
