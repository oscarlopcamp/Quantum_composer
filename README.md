# Quantum Composer Local

An offline Python-based quantum circuit composer and visualizer built with PyQt5 and Qiskit.

## Features

- Add/remove qubits
- Apply quantum gates (H, X, Y, Z, S, T, RX, RY, RZ, CX)
- Simulate and visualize results (Bloch sphere, histogram, qsphere)
- Built for offline educational use
- Multi-qubit support with entanglement visualization
- Export circuit images

## Requirements

- Python 3.12 (recommended)
- See `requirements.txt` for Python package dependencies

## Installation & Run

1. **Clone or download** this repository and navigate to the project folder:
   ```bash
   cd quantum_composer
   ```

2. **Create and activate** a virtual environment (**Python 3.12 recommended**):
   ```bash
   # Windows (PowerShell)
   py -3.12 -m venv .venv
   .venv\Scripts\Activate.ps1

   # macOS / Linux
   python3.12 -m venv .venv
   source .venv/bin/activate
   ```

3. **Upgrade pip** (important to avoid build issues):
   ```bash
   python -m pip install --upgrade pip setuptools wheel
   ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application**:
   ```bash
   python main.py
   ```

## Notes

- If you see an error about missing libraries such as `pylatexenc` or `seaborn`, make sure they are listed in `requirements.txt` and install them:
  ```bash
  pip install pylatexenc seaborn
  ```
- This project uses the new Qiskit Aer API:
  ```python
  from qiskit_aer import Aer, AerSimulator
  from qiskit import transpile
  ```
- Tested on Python 3.12 with Qiskit 1.x

## License

MIT License
