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
                     // Clean up existing layer when updating
          if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
          }

          // Convert GeoJSON to heatmap data format
          const heatmapData = data.features.map(feature => {
            const coords = feature.geometry.coordinates;
            const lux = feature.properties.lux;
            
                         // Use discrete normalization to exactly match the legend
            let intensity;
            if (lux === 0) {
                             intensity = 0.03; // Special value for zero points
            } else if (lux <= 1) {
                             intensity = 0.15; // 0-1 lux
            } else if (lux <= 5) {
                             intensity = 0.40; // 1-5 lux
            } else if (lux <= 10) {
                             intensity = 0.65; // 5-10 lux
            } else if (lux <= 15) {
                             intensity = 0.80; // 10-15 lux
            } else {
                             intensity = 0.95; // 15+ lux
            }
            
            return [coords[1], coords[0], intensity]; // [lat, lng, intensity]
          });

          console.log("Heatmap data:", heatmapData.slice(0, 5)); 
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

          // Create heatmap layer

          if (typeof L.heatLayer === 'undefined') {
            console.error("L.heatLayer is not available!");
            return;
          }

          // Now create the main heatmap layer
          const heatmap = L.heatLayer(heatmapData, {
            radius: 20,        // Smaller radius for data points
            blur: 10,          // Less blur for a sharper display of points
            maxZoom: 8,
            minOpacity: 0.5,      // minimal opacity for data
            gradient: {
              // Key point: change the gradient to match our new normalization approach
              0.0: 'rgba(61, 59, 43, 0.7)',     // 0 lux - black
              0.05: 'rgba(61, 59, 43, 0.7)',    // 0 lux - black (continued)
              0.1: 'rgba(139, 69, 19, 0.85)', // 0-1 lux - dark brown
              0.2: 'rgba(139, 69, 19, 0.85)', // 0-1 lux (continued)
              0.3: 'rgba(255, 140, 0, 0.8)',  // 1-5 lux - orange
              0.5: 'rgba(255, 140, 0, 0.8)',  // 1-5 lux (continued)
              0.6: 'rgba(202, 148, 174, 0.8)', // 5-10 lux - pink
              0.7: 'rgba(202, 148, 174, 0.8)', // 5-10 lux (continued)
              0.75: 'rgba(251, 255, 0, 0.85)',  // 10-15 lux - bright green
              0.85: 'rgba(251, 255, 0, 0.85)',  // 10-15 lux (continued)
              0.9: 'rgb(191,255,0)',   // 15+ lux - bright
              1.0: 'rgb(191,255,0)'   // 15+ lux (continued)
            },
            max: 1
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
                { value: 0, color: 'rgba(61, 59, 43, 0.7)', label: '0 lux' },
                { value: 1, color: 'rgba(139, 69, 19, 0.85)', label: '0-1 lux' },
                { value: 5, color: 'rgba(255, 140, 0, 0.8)', label: '1-5 lux' },
                { value: 10, color: 'rgba(202, 148, 174, 0.8)', label: '5-10 lux' },
                { value: 15, color: 'rgba(251, 255, 0, 0.85)', label: '10-15 lux' },
                { value: 25, color: 'rgb(191,255,0)', label: '15+ lux' }
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