// --- Frontend: PollTool.jsx ---
import { useToolContext } from "../ToolContext";
import { useEffect, useState } from "react";
import PollModal from "../PollModal";

function PollTool() {
  const { activeTool, setActiveTool } = useToolContext();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (activeTool === "poll") {
      setModalOpen(true);
    }
  }, [activeTool]);

  const handleSubmit = () => {
    setModalOpen(false);
    setActiveTool(null);
  };

  return (
    <PollModal
      isOpen={modalOpen}
      onClose={() => {
        setModalOpen(false);
        setActiveTool(null);
      }}
      onSubmit={handleSubmit}
      existingPoll={{
        id: "munich-unsafe-areas",
        question: "In which area of Munich have you felt the most unsafe?",
        options: [
          "Hauptbahnhof (Central Station)",
          "Sendlinger Tor",
          "Theresienwiese (Festival Grounds)",
          "Hasenbergl",
          "Neuperlach Süd",
          "Maxvorstadt (late at night)"
        ]
      }}
    />
  );
}

export default PollTool;