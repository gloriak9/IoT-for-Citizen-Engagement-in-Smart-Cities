import { useToolContext } from "../ToolContext";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

function LightingTool() {
  const { activeTool } = useToolContext();
  const map = useMap();

  useEffect(() => {
    if (activeTool === "lighting") {
      map.setZoom(15);
    }
  }, [activeTool, map]);

  if (activeTool !== "lighting") return null;

  // Could display lighting markers or heatmap here
  return null;
}

export default LightingTool;
