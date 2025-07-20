import { useToolContext } from "../ToolContext";
import { useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

function LightingTool() {
  const { activeTool } = useToolContext();
  const map = useMap();
  const [layerGroup, setLayerGroup] = useState(null);
  const [legendControl, setLegendControl] = useState(null);

  useEffect(() => {
    if (activeTool === "lighting") {
      fetch("/combined_lux_gps.geojson")
        .then(res => res.json())
        .then(data => {
          if (layerGroup) {
            map.removeLayer(layerGroup);
          }

          const jitter = 0.00005; // small offset for overlapping points
          const newLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              const lux = feature.properties.lux;
              const jitteredLatlng = L.latLng(
                latlng.lat + (Math.random() - 0.5) * jitter,
                latlng.lng + (Math.random() - 0.5) * jitter
              );

              return L.circleMarker(jitteredLatlng, {
                radius: 6,
                fillColor: getColor(lux),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
              }).bindPopup(`Lux: ${lux}<br/>Time: ${feature.properties.timestamp}`);
            }
          });

          newLayer.addTo(map);
          setLayerGroup(newLayer);

          if (data.features.length > 0) {
            map.fitBounds(newLayer.getBounds());
          }

          // Add legend once
          if (!legendControl) {
            const legend = L.control({ position: "bottomright" });

            legend.onAdd = function () {
              const div = L.DomUtil.create("div", "info legend");
              const grades = [0, 1, 5, 10, 25];
              const labels = [];

              for (let i = 0; i < grades.length; i++) {
                const from = grades[i];
                const to = grades[i + 1];
                const color = getColor(from === 0 ? 0 : from + 1);


                labels.push(
                  `<i style="background:${color}; width: 12px; height: 12px; display:inline-block; margin-right: 5px;"></i> ` +
                  from + (to ? "&ndash;" + to : "+")
                );
              }

              div.innerHTML = `<strong>Lux Level</strong><br>${labels.join("<br>")}`;
              return div;
            };

            legend.addTo(map);
            setLegendControl(legend);
          }
        });
    } else {
      if (layerGroup) {
        map.removeLayer(layerGroup);
        setLayerGroup(null);
      }

      if (legendControl) {
        legendControl.remove();
        setLegendControl(null);
      }
    }
  }, [activeTool, map]);

  return null;
}

// Color scale for lux values
function getColor(lux) {
  return lux > 25 ? "#03fc6bff" :
        lux > 10 ? "#6faf51ff" :
         lux > 5 ? "#ccf04dff" :
         lux > 1 ? "#f37611ff" :
                    "#530303ff";
}

export default LightingTool;
