from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QPushButton, QComboBox, QLabel,
    QSpacerItem, QSizePolicy, QGridLayout
)
from quantum.visual import generar_imagen_circuito, generar_resultado
from gui.componentes.dialogo_cx import VentanaCX

class BarraBotones(QWidget):
    def __init__(self, simulador, vista_circuito, vista_resultado, parent=None):
        super().__init__(parent)
        self.simulador = simulador
        self.vista_circuito = vista_circuito
        self.vista_resultado = vista_resultado
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()

        label_qubit = QLabel("Aplicar a qubit:")
        self.combo_qubit = QComboBox()
        self._actualizar_selector_qubits()
        layout.addWidget(label_qubit)
        layout.addWidget(self.combo_qubit)

        # 🏷 Título de compuertas
        titulo_compuertas = QLabel("Operaciones Cuánticas")
        titulo_compuertas.setStyleSheet("font-weight: bold; font-size: 13px; margin-top: 10px; margin-bottom: 4px;")
        layout.addWidget(titulo_compuertas)

        compuertas = ["H", "X", "Y", "Z", "S", "T", "RX", "RY", "RZ", "CX"]
        colores = {
            "H": "#ff5f5f", "X": "#3366cc", "Y": "#cc33cc", "Z": "#3366cc",
            "S": "#66ccff", "T": "#66ccff", "RX": "#cc6699", "RY": "#cc6699",
            "RZ": "#66cccc", "CX": "#003366"
        }

        grid = QGridLayout()
        for i, nombre in enumerate(compuertas):
            boton = QPushButton(nombre)
            boton.setFixedSize(48, 36)
            boton.setStyleSheet(f"""
                QPushButton {{
                    background-color: {colores.get(nombre, "#dddddd")};
                    color: white;
                    border-radius: 6px;
                    font-weight: bold;
                    font-size: 11px;
                }}
            """)
            boton.clicked.connect(lambda _, n=nombre: self.accion(n))
            grid.addWidget(boton, i // 3, i % 3)
        layout.addLayout(grid)

        layout.addSpacerItem(QSpacerItem(20, 20, QSizePolicy.Minimum, QSizePolicy.Expanding))

        boton_agregar = QPushButton("➕ Agregar Qubit")
        boton_agregar.clicked.connect(self.agregar_qubit)
        layout.addWidget(boton_agregar)

        boton_eliminar = QPushButton("➖ Eliminar Qubit")
        boton_eliminar.clicked.connect(self.eliminar_qubit)
        layout.addWidget(boton_eliminar)

        boton_deshacer = QPushButton("↩️ Remover última compuerta")
        boton_deshacer.clicked.connect(self.remover_ultima_puerta)
        layout.addWidget(boton_deshacer)

        self.setLayout(layout)

        self.setStyleSheet("""
            QWidget {
                background-color: #f4f8fb;
                border-right: 1px solid #d0d0d0;
            }

            QPushButton {
                padding: 6px;
            }
        """)

    def _actualizar_selector_qubits(self):
        self.combo_qubit.clear()
        for i in range(self.simulador.num_qubits):
            self.combo_qubit.addItem(f"Qubit {i}", i)

    def accion(self, nombre):
        if nombre == "CX":
            dialogo = VentanaCX(self.simulador.num_qubits)
            if dialogo.exec_():
                control, objetivo = dialogo.obtener_qubits()
                if control != objetivo:
                    self.simulador.qc.cx(control, objetivo)
                    self.simulador.historial.append(self.simulador.qc.copy())
        else:
            index = self.combo_qubit.currentData()
            self.simulador.aplicar_puerta(nombre, index)

        self._actualizar_todo()

    def agregar_qubit(self):
        self.simulador.incrementar_qubit()
        self._actualizar_selector_qubits()
        self._actualizar_todo()

    def eliminar_qubit(self):
        self.simulador.eliminar_qubit()
        self._actualizar_selector_qubits()
        self._actualizar_todo()

    def remover_ultima_puerta(self):
        self.simulador.remover_ultima()
        self._actualizar_selector_qubits()
        self._actualizar_todo()

    def _actualizar_todo(self):
        generar_imagen_circuito(self.simulador.qc)
        generar_resultado(self.simulador)
        self.vista_circuito.actualizar()
        self.vista_resultado.actualizar()
