import { useToolContext } from "../ToolContext";
import { useMapEvents } from "react-leaflet";
import { useState } from "react";
import { Popup } from "react-leaflet";

function PollTool() {
  const { activeTool, setActiveTool } = useToolContext();
  const [showForm, setShowForm] = useState(true);
  const [formValues, setFormValues] = useState({
    question: "Which area in Munich do you feel most unsafe at night?",
    answer: "",
    appVersion: "1.0.0" 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in formValues) {
      formData.append(key, formValues[key]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/polls", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Poll submitted:", data);
      alert("Thank you for your response!");
    } catch (error) {
      console.error("Error submitting poll:", error);
      alert("Submission failed. Try again later.");
    }

    setShowForm(false);
    setActiveTool(null);
  };

  useMapEvents({
    click(e) {
      if (activeTool === "poll" && showForm) {
        const popup = document.querySelector(".leaflet-popup");
        if (!popup || !popup.contains(e.originalEvent.target)) {
          setShowForm(false);
          setActiveTool(null);
        }
      }
    }
  });

  if (activeTool !== "poll" || !showForm) return null;

  return (
    <Popup position={[48.1351, 11.5820]} closeButton={false}>
      {activeTool === "poll" && showForm ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "270px" }}>
          <h4>Poll: Safety in Munich</h4>
          <label>{formValues.question}</label>
          <select name="answer" value={formValues.answer} onChange={handleChange} required>
            <option value="" disabled>Select an area</option>
            <option>Hauptbahnhof (Central Station)</option>
            <option>Giesing</option>
            <option>Hasenbergl</option>
            <option>Neuperlach</option>
            <option>Schwabing</option>
            <option>Sendling</option>
            <option>Englischer Garten</option>
            <option>Other</option>
          </select>

          <button type="submit" style={{ marginTop: "10px" }}>Submit Response</button>
        </form>
      ) : null}
    </Popup>
  );
}

export default PollTool;