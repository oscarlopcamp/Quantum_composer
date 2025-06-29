from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel
from PyQt5.QtGui import QPixmap

class VistaCircuito(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)

        self.label_imagen = QLabel()
        self.label_imagen.setPixmap(QPixmap("output/circuito.png"))
        self.label_imagen.setMinimumHeight(300)

        layout = QVBoxLayout()
        layout.addWidget(self.label_imagen)
        self.setLayout(layout)

        self.setStyleSheet("""
            QLabel {
                border: 1px solid #cccccc;
                border-radius: 4px;
                background-color: #ffffff;
                padding: 4px;
            }
        """)

    def actualizar(self):
        self.label_imagen.setPixmap(QPixmap("output/circuito.png"))
