# TwinMineX Run Guide

Follow these steps to run the complete real-time 3D digital twin system, which links the frontend dashboard with the headless Python simulation engine.

---

## 📋 Prerequisites
1. **Node.js** (v18+)
2. **Python 3.12** (with `numpy`, `scipy`, `websockets`, `simpy`, `pygame`, `pandas`, `scikit-learn` installed)

---

## 🚀 Execution Steps

To run the full digital twin, you need to open **three separate terminals** (one for each service):

### 1️⃣ Terminal 1: Node.js Express API Backend
This server provides initial static configurations (like towers metadata).
```bash
cd backend
npm install
npm start
```
* Runs on: `http://localhost:5000`

### 2️⃣ Terminal 2: Python Simulation Server
This is the heart of the digital twin, running the MPC, SimPy schedulers, Kalman filters, and K-Median algorithms, broadcasting real-time coordinates over WebSockets.
```bash
cd ../Integration_Simulation_Gemini/Simulation
& "C:\Users\DAIICT B\AppData\Local\Programs\Python\Python312\python.exe" spatial_server.py
```
* WebSocket port: `ws://localhost:8765`

### 3️⃣ Terminal 3: Vite React Frontend Dashboard
This starts the web server serving the 3D visualization dashboard.
```bash
cd mine-digital-twin/frontend
npm install
npm run dev
```
* Web Dashboard runs on: `http://localhost:5173` (or `http://localhost:5174`)

---

## 🎮 Testing the Digital Twin Control Station

### Real-Time Telemetry
Once all three servers are running, the trucks and towers in the 3D scene will smoothly glide along the road segments, driven entirely by the Python MPC controller and Kalman Filter telemetry updates.

### Interactive Controls
1. **Stop & Auto Controls for Trucks**:
   - Left-click on any moving truck in the 3D scene (or select it from the sidebar list).
   - In the top-right **Selected Unit** card, click **STOP** to halt the vehicle instantly.
   - Click **AUTO** to release the speed clamp and return control to the MPC pathfinder.
2. **Power & Battery Controls for Towers**:
   - Select any communication tower.
   - Click **POWER OFF** to shut down the tower (the green coverage sphere and wireframe will disappear, and signal levels of nearby trucks will drop). Click **POWER ON** to boot it back up.
   - Click **RECHARGE** to reset the battery levels back to 100%.

### 🔄 Automatic Reconnect Fallback
- If you terminate the Python simulation server (`Ctrl+C` in Terminal 2), the frontend will automatically detect the connection loss, switch back to its **internal client-side mock simulation**, and print a connection warning.
- When you start the Python server again, the frontend will automatically reconnect and resume live telemetry tracking without requiring a manual page refresh.
