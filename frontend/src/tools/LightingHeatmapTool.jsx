import { useToolContext } from "../ToolContext";
import { useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

function LightingHeatmapTool() {
  const { activeTool } = useToolContext();
  const map = useMap();
  const [heatmapLayer, setHeatmapLayer] = useState(null);
  const [legendControl, setLegendControl] = useState(null);

  useEffect(() => {
    if (activeTool === "lighting-heatmap") {
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
            // Normalize intensity based on lux value (0-25 range)
            const intensity = Math.min(lux / 25, 1);
            return [coords[1], coords[0], intensity]; // [lat, lng, intensity]
          });

          // Create heatmap layer
          const heatmap = L.heatLayer(heatmapData, {
            radius: 25,
            blur: 15,
            maxZoom: 10,
            gradient: {
              0.0: '#000000',    // Very dark (no light)
              0.2: '#530303',     // Dark red (very low light)
              0.4: '#f37611',     // Orange (low light)
              0.6: '#ccf04d',     // Yellow (medium light)
              0.8: '#6faf51',     // Light green (good light)
              1.0: '#03fc6b'      // Bright green (excellent light)
            },
            max: 1
          });

          heatmap.addTo(map);
          setHeatmapLayer(heatmap);

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
              
              const grades = [
                { value: 0, color: '#000000', label: 'No Light' },
                { value: 1, color: '#530303', label: 'Very Low' },
                { value: 5, color: '#f37611', label: 'Low' },
                { value: 10, color: '#ccf04d', label: 'Medium' },
                { value: 15, color: '#6faf51', label: 'Good' },
                { value: 25, color: '#03fc6b', label: 'Excellent' }
              ];
              
              const labels = grades.map(grade => 
                `<div style="margin: 5px 0;">
                  <i style="background:${grade.color}; width: 20px; height: 20px; display:inline-block; margin-right: 8px; border-radius: 3px;"></i>
                  <span style="font-size: 12px;">${grade.label} (${grade.value}+ lux)</span>
                </div>`
              ).join('');

              div.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px; color: #333;">Lighting Heatmap</div>
                ${labels}
                <div style="margin-top: 8px; font-size: 11px; color: #666;">
                  Intensity shows light levels across the city
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