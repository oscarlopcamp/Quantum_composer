from qiskit import QuantumCircuit, Aer, execute

class SimuladorQubit:
    def __init__(self, num_qubits=1):
        self.num_qubits = num_qubits
        self.qc = QuantumCircuit(num_qubits)
        self.historial = []

    def aplicar_puerta(self, puerta, qubit):
        if puerta == 'H':
            self.qc.h(qubit)
        elif puerta == 'X':
            self.qc.x(qubit)
        elif puerta == 'Y':
            self.qc.y(qubit)
        elif puerta == 'Z':
            self.qc.z(qubit)
        elif puerta == 'S':
            self.qc.s(qubit)
        elif puerta == 'T':
            self.qc.t(qubit)
        elif puerta == 'RX':
            self.qc.rx(3.14 / 2, qubit)
        elif puerta == 'RY':
            self.qc.ry(3.14 / 2, qubit)
        elif puerta == 'RZ':
            self.qc.rz(3.14 / 2, qubit)

        self.historial.append(self.qc.copy())

    def simular(self):
        backend = Aer.get_backend('statevector_simulator')
        job = execute(self.qc, backend)
        resultado = job.result()
        estado = resultado.get_statevector(self.qc)
        return estado

    def medir(self, shots=1024):
        qc_medir = self.qc.copy()
        qc_medir.measure_all()
        backend = Aer.get_backend('qasm_simulator')
        job = execute(qc_medir, backend, shots=shots)
        resultado = job.result()
        return resultado.get_counts()

    def incrementar_qubit(self):
        self.num_qubits += 1
        self.qc = QuantumCircuit(self.num_qubits)
        self.historial = []

    def eliminar_qubit(self):
        if self.num_qubits > 1:
            self.num_qubits -= 1
            self.qc = QuantumCircuit(self.num_qubits)
            self.historial = []

    def remover_ultima(self):
        if self.historial:
            self.historial.pop()
            if self.historial:
                self.qc = self.historial[-1].copy()
            else:
                self.qc = QuantumCircuit(self.num_qubits)
