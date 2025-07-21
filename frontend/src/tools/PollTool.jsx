// --- Frontend: PollTool.jsx ---
import { useToolContext } from "../ToolContext";
import { useEffect } from "react";

function PollTool() {
  const { activeTool, setActiveTool } = useToolContext();

  useEffect(() => {
    if (activeTool === "poll") {
      // Placeholder action: just deactivate the tool immediately
      setActiveTool(null);
    }
  }, [activeTool, setActiveTool]);

  return null; // Nothing is rendered
}

export default PollTool;
