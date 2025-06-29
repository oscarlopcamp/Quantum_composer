from PyQt5.QtWidgets import (
    QApplication, QWidget, QHBoxLayout, QVBoxLayout, QLabel,
    QPushButton, QMessageBox
)
from PyQt5.QtGui import QGuiApplication, QIcon

from gui.componentes.vista_circuito import VistaCircuito
from gui.componentes.vista_resultado import VistaResultado
from gui.componentes.barra_botones import BarraBotones
from quantum.simulador import SimuladorQubit
from quantum.visual import generar_imagen_circuito, generar_resultado

class VentanaPrincipal(QWidget):
    def __init__(self):
        super().__init__()

        # ✅ Icono personalizado
        self.setWindowIcon(QIcon("assets/quantum_icon.ico"))

        # ✅ Título de ventana y tamaño
        self.setWindowTitle("Quantum Composer")
        self.resize(1600, 900)
        self.centrar_en_pantalla()

        # 🧠 Simulador
        self.simulador = SimuladorQubit()

        # 🧱 Componentes visuales
        self.vista_circuito = VistaCircuito()
        self.vista_resultado = VistaResultado()
        self.barra_botones = BarraBotones(self.simulador, self.vista_circuito, self.vista_resultado)

        # 📸 Inicializar visualizaciones
        generar_imagen_circuito(self.simulador.qc)
        generar_resultado(self.simulador)

        # 🧩 Lado izquierdo: título + barra + botón info
        layout_izquierdo = QVBoxLayout()
        titulo_operaciones = QLabel("Operaciones Cuánticas")
        titulo_operaciones.setStyleSheet("font-weight: bold; font-size: 14px;")
        layout_izquierdo.addWidget(titulo_operaciones)
        layout_izquierdo.addWidget(self.barra_botones)

        boton_info = QPushButton("ℹ️ Info del software")
        boton_info.setStyleSheet("margin-top: 10px;")
        boton_info.clicked.connect(self.mostrar_info)
        layout_izquierdo.addWidget(boton_info)

        # 🧪 Circuito generado
        layout_superior = QVBoxLayout()
        titulo_circuito = QLabel("Circuito Generado")
        titulo_circuito.setStyleSheet("font-weight: bold; font-size: 14px; margin-bottom: 6px;")
        layout_superior.addWidget(titulo_circuito)
        layout_superior.addWidget(self.vista_circuito)

        # 📊 Resultados
        layout_resultados = QVBoxLayout()
        titulo_resultado = QLabel("Resultados Cuánticos y Estado Cuántico")
        titulo_resultado.setStyleSheet("font-weight: bold; font-size: 14px; margin-bottom: 6px;")
        layout_resultados.addWidget(titulo_resultado)
        layout_resultados.addWidget(self.vista_resultado)

        # 🧱 Panel derecho
        panel_derecho = QVBoxLayout()
        panel_derecho.addLayout(layout_superior)
        panel_derecho.addLayout(layout_resultados)

        # 🧱 Layout principal
        layout_principal = QHBoxLayout()
        layout_principal.addLayout(layout_izquierdo)
        layout_principal.addLayout(panel_derecho)
        self.setLayout(layout_principal)

    def centrar_en_pantalla(self):
        screen = QGuiApplication.primaryScreen()
        screen_geometry = screen.availableGeometry()
        x = (screen_geometry.width() - self.width()) // 2
        y = (screen_geometry.height() - self.height()) // 2
        self.move(x, y)

    def mostrar_info(self):
        QMessageBox.information(
            self,
            "Información del software",
            "Quantum Composer\n\n"
            "Software educativo para visualización cuántica desarrollado por:\n"
            "Oscar Alejandro López Campero\n\n"
            "Centro Nacional de Investigación y Desarrollo Tecnológico (CENIDET)"
        )

def mostrar_ventana():
    app = QApplication([])
    ventana = VentanaPrincipal()
    ventana.show()
    app.exec_()

