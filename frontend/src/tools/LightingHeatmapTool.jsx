import { useToolContext } from "../ToolContext";
import { useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet.heat";

function LightingHeatmapTool() {
  const { activeTool } = useToolContext();
  const map = useMap();
  const [heatmapLayer, setHeatmapLayer] = useState(null);
  const [legendControl, setLegendControl] = useState(null);

  useEffect(() => {
    console.log("LightingHeatmapTool: activeTool =", activeTool);
    if (activeTool === "lighting-heatmap") {
      console.log("Loading heatmap data...");
      fetch("/combined_lux_gps.geojson")
        .then(res => res.json())
        .then(data => {
          if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
          }

          // Convert GeoJSON to heatmap data format
          const heatmapData = data.features.map(feature => {
            const coords = feature.geometry.coordinates;
            const lux = feature.properties.lux;
            // Normalize intensity: lux / 25 to get 0-1 range, with minimum threshold
            const intensity = Math.max(Math.min(lux / 25, 1), 0.01); // Minimum 0.01 to avoid transparency
            return [coords[1], coords[0], intensity]; // [lat, lng, intensity]
          });

          console.log("Heatmap data:", heatmapData.slice(0, 5)); // Show first 5 points
          console.log("Total heatmap points:", heatmapData.length);
          
          // Analyze data distribution
          const luxValues = data.features.map(f => f.properties.lux);
          const distribution = {
            '0-1': luxValues.filter(l => l <= 1).length,
            '1-5': luxValues.filter(l => l > 1 && l <= 5).length,
            '5-10': luxValues.filter(l => l > 5 && l <= 10).length,
            '10-25': luxValues.filter(l => l > 10 && l <= 25).length,
            '25+': luxValues.filter(l => l > 25).length
          };
          console.log("Data distribution:", distribution);

          // Calculate dynamic max value
          //const maxIntensity = Math.max(...heatmapData.map(point => point[2]));

          // Create heatmap layer
          
          if (typeof L.heatLayer === 'undefined') {
            console.error("L.heatLayer is not available!");
            return;
          }
          
          const heatmap = L.heatLayer(heatmapData, {
            radius: 40,
            blur: 40,
            maxZoom: 10,
            opacity: 0.8,           // Increase opacity to make heatmap more visible
            gradient: {
              0.0: 'rgba(0, 0, 0, 0.4)',     // 0 lux - black, 40% opacity
              0.04: 'rgba(139, 69, 19, 0.8)', // dark brown
              0.36: 'rgba(255, 140, 0, 0.6)', // orange
              0.72: 'rgba(159, 205, 50, 0.7)', // green
              0.76: 'rgba(251, 255, 0, 0.71)',   // bright green
              1.0: 'rgba(238, 255, 0, 0.99)'     // maximum
            },
            max: 1                  // Fixed max for normalized 0-1 range
          });

          heatmap.addTo(map);
          setHeatmapLayer(heatmap);
          
          // Verify heatmap is visible
          setTimeout(() => {
            console.log("Heatmap layer after 1s:", heatmap);
            console.log("Map layers:", map._layers);
          }, 1000);

          // Fit bounds to data
          if (data.features.length > 0) {
            const bounds = L.latLngBounds(
              data.features.map(f => [f.geometry.coordinates[1], f.geometry.coordinates[0]])
            );
            map.fitBounds(bounds);
          }

          // Add legend
          if (!legendControl) {
            const legend = L.control({ position: "bottomright" });

            legend.onAdd = function () {
              const div = L.DomUtil.create("div", "info legend");
              div.style.backgroundColor = "white";
              div.style.padding = "10px";
              div.style.borderRadius = "5px";
              div.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
              
              // Calculate statistics for legend
              const luxValues = data.features.map(f => f.properties.lux);
              const avgLux = luxValues.reduce((a, b) => a + b, 0) / luxValues.length;
              const minLux = Math.min(...luxValues);
              const maxLux = Math.max(...luxValues);
              
              const grades = [
                { value: 0, color: 'rgba(0, 0, 0, 0.4)', label: '0 lux' },
                { value: 1, color: 'rgba(139, 69, 19, 0.8)', label: '0-1 lux' },
                { value: 5, color: 'rgba(255, 140, 0, 0.6)', label: '1-5 lux' },
                { value: 10, color: 'rgba(159, 205, 50, 0.7)', label: '5-10 lux' },
                { value: 15, color: 'rgba(251, 255, 0, 0.71)', label: '10-15 lux' },
                { value: 25, color: 'rgba(238, 255, 0, 0.99)', label: '15+ lux' }
              ];
              
              const labels = grades.map(grade => 
                `<div style="margin: 5px 0;">
                  <i style="background:${grade.color}; width: 20px; height: 20px; display:inline-block; margin-right: 8px; border-radius: 3px;"></i>
                  <span style="font-size: 12px;">${grade.label}</span>
                </div>`
              ).join('');

              div.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px; color: #333;">Lux Level</div>
                ${labels}
                <hr style="margin: 8px 0; border: 1px solid #eee;">
                <div style="font-size: 11px; color: #666;">
                  <strong>Statistics:</strong><br/>
                  Avg: ${avgLux.toFixed(1)} lux<br/>
                  Range: ${minLux}-${maxLux} lux<br/>
                  Points: ${luxValues.length}
                </div>
              `;
              return div;
            };

            legend.addTo(map);
            setLegendControl(legend);
          }
        })
        .catch(error => {
          console.error("Error loading lighting data:", error);
        });
          } else {
        if (heatmapLayer) {
          map.removeLayer(heatmapLayer);
          setHeatmapLayer(null);
        }

      if (legendControl) {
        legendControl.remove();
        setLegendControl(null);
      }
    }
  }, [activeTool, map]);

  return null;
}

export default LightingHeatmapTool;
