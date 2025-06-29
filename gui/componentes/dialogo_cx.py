from PyQt5.QtWidgets import QDialog, QVBoxLayout, QComboBox, QLabel, QPushButton, QHBoxLayout

class VentanaCX(QDialog):
    def __init__(self, num_qubits):
        super().__init__()
        self.setWindowTitle("Seleccionar qubits para CX")
        self.setFixedSize(300, 150)

        layout = QVBoxLayout()

        self.combo_control = QComboBox()
        self.combo_objetivo = QComboBox()
        for i in range(num_qubits):
            self.combo_control.addItem(f"Qubit {i}", i)
            self.combo_objetivo.addItem(f"Qubit {i}", i)

        layout.addWidget(QLabel("Qubit controlador:"))
        layout.addWidget(self.combo_control)
        layout.addWidget(QLabel("Qubit objetivo:"))
        layout.addWidget(self.combo_objetivo)

        botones = QHBoxLayout()
        btn_ok = QPushButton("Aplicar")
        btn_ok.clicked.connect(self.accept)
        btn_cancel = QPushButton("Cancelar")
        btn_cancel.clicked.connect(self.reject)
        botones.addWidget(btn_ok)
        botones.addWidget(btn_cancel)

        layout.addLayout(botones)
        self.setLayout(layout)

    def obtener_qubits(self):
        return self.combo_control.currentData(), self.combo_objetivo.currentData()
