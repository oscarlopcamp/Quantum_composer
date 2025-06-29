import os
import matplotlib.pyplot as plt
from qiskit.visualization import (
    circuit_drawer,
    plot_histogram,
    plot_bloch_multivector,
    plot_state_qsphere
)

def generar_imagen_circuito(circuito, ruta="output/circuito.png"):
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    circuito.draw(output='mpl', filename=ruta)

def generar_resultado(simulador, ruta="output/resultado.png"):
    os.makedirs(os.path.dirname(ruta), exist_ok=True)

    if simulador.num_qubits == 1:
        estado = simulador.simular()
        fig = plot_bloch_multivector(estado)
        fig.savefig(ruta, bbox_inches='tight')
        plt.close(fig)

    else:
        estado = simulador.simular()
        counts = simulador.medir()

        # Histograma
        fig1 = plot_histogram(counts)
        fig1.savefig("output/resultado.png", bbox_inches='tight')
        plt.close(fig1)

        # QSphere
        fig2 = plot_state_qsphere(estado)
        fig2.savefig("output/qsfera.png", bbox_inches='tight')
        plt.close(fig2)
