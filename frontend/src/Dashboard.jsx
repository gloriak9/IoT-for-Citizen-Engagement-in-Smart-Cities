// src/Dashboard.js
import React from "react";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <iframe
        title="Grafana Dashboard"
        src="https://grafana.com/products/cloud/?pg=oss-graf&plcmt=hero-txt"
        width="100%"
        height="1000px"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default Dashboard;
