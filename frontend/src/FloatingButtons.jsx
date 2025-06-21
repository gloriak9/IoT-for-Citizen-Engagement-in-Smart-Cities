import { toolRegistry } from "./toolRegistry";
import { useToolContext } from "./ToolContext";

function FloatingButtons() {
  const { activeTool, setActiveTool } = useToolContext();

  return (
    <div className="floating-buttons">
      {toolRegistry.map((tool) => (
        <button
          key={tool.id}
          onClick={() =>
            setActiveTool(activeTool === tool.id ? null : tool.id)
          }
          className={activeTool === tool.id ? "active" : ""}
        >
          {tool.label}
        </button>
      ))}
      <button onClick={() => setActiveTool(null)} className="close">✖</button>
    </div>
  );
}

export default FloatingButtons;
