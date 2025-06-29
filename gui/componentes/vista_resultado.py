from PyQt5.QtWidgets import QWidget, QHBoxLayout, QLabel
from PyQt5.QtGui import QPixmap

class VistaResultado(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)

        self.label_histograma = QLabel()
        self.label_histograma.setPixmap(QPixmap("output/resultado.png"))
        self.label_histograma.setMinimumHeight(300)

        self.label_qsfera = QLabel()
        self.label_qsfera.setPixmap(QPixmap("output/qsfera.png"))
        self.label_qsfera.setMinimumHeight(300)

        layout = QHBoxLayout()
        layout.addWidget(self.label_histograma)
        layout.addWidget(self.label_qsfera)
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
        self.label_histograma.setPixmap(QPixmap("output/resultado.png"))
        self.label_qsfera.setPixmap(QPixmap("output/qsfera.png"))
