# ⛏️ TwinMineX

### Real-Time Digital Twin for Connected Mining Operations

MineOps 360 is an interactive 3D digital twin platform that simulates and visualizes mining operations in real time. The platform provides a centralized dashboard for monitoring haul trucks, communication towers, network coverage, fleet telemetry, and operational analytics within a virtual mining environment.

---

## 🚀 Features

### 🌍 Interactive 3D Mine Visualization

* Real-time 3D representation of the mining site using Three.js.
* Interactive camera controls for navigation and inspection.
* Digital twin view of pits, dump sites, roads, trucks, and communication towers.

### 🚚 Fleet Monitoring

* Live truck movement simulation.
* Individual truck telemetry.
* Fleet status dashboard.
* Vehicle selection and focus tracking.

### 📡 Network Coverage Monitoring

* Communication tower visualization.
* Tower coverage zones and signal ranges.
* Dynamic tower relocation based on truck congestion.
* Real-time network coverage insights.

### 📊 Operations Dashboard

* Fleet analytics panel.
* Signal strength monitoring.
* KPI cards and operational metrics.
* Telemetry and status panels.

### 🔥 Digital Twin Intelligence

* Congestion hotspot detection.
* Dynamic tower repositioning.
* Predictive network optimization.
* Real-time operational awareness.

---

## 🛠️ Technology Stack

| Component         | Technology |
| ----------------- | ---------- |
| Frontend          | React      |
| 3D Visualization  | Three.js   |
| Backend           | Node.js    |
| API Layer         | Express.js |
| Database          | MongoDB    |
| Data Exchange     | REST APIs  |
| Future XR Support | WebXR      |

---

## 📂 Project Structure

```bash
```bash
TwinMineX/
│
├── backend/
│   ├── dataset/
│   │   └── selected-routes/
│   │
│   ├── output/
│   │   ├── trucks.json
│   │   ├── towers.json
│   │   └── routes.json
│   │
│   ├── scripts/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── AlertSystem.jsx
│   │   │   ├── EnvironmentPanel.jsx
│   │   │   ├── InfoPanel.jsx
│   │   │   ├── KpiCards.jsx
│   │   │   ├── LiveChartsModal.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatusBar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── TruckInfoPanel.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── MineScene.js
│   │   ├── heatmap.js
│   │   ├── index.css
│   │   └── main.js
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── eslint.config.js
│
├── .gitignore
└── README.md
```

```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Anistina-Dsouza/TwinMine.git
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## 🎯 Use Cases

* Mining Operations Monitoring
* Fleet Management
* Network Coverage Optimization
* Digital Twin Demonstrations
* Smart Mining Research
* Industry 4.0 Applications

---

## 🔮 Future Enhancements

* AI-Based Tower Optimization
* Predictive Signal Analytics
* Incident Simulation
* Heatmap Visualization
* AR/VR Digital Twin Experience
* Autonomous Fleet Simulation
* Real-Time IoT Integration

---

## 👩‍💻 Author

**Anistina Dsouza**

MSc IT Student | Digital Twin & Smart Mining Enthusiast

---

## 📜 License

This project is licensed under the MIT License.
