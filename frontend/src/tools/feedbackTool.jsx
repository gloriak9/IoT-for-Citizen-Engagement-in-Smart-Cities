import { useToolContext } from "../ToolContext";
import { useMapEvents } from "react-leaflet";
import { useState } from "react";
import { Popup } from "react-leaflet";

function FeedbackTool() {
  const { activeTool, setActiveTool } = useToolContext();
  const [showForm, setShowForm] = useState(true);
  const [formValues, setFormValues] = useState({
    category: "General Feedback",
    locationDescription: "",
    timeOfIncident: "",
    description: "",
    severity: "Medium",
    name: "",
    email: "",
    appVersion: "1.0.0" // Example version
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormValues((prev) => ({
      ...prev,
      photo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in formValues) {
      formData.append(key, formValues[key]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/feedbacks", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Feedback submitted:", data);
      alert("Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Submission failed. Try again later.");
    }

    setShowForm(false);
    setActiveTool(null);
  };

useMapEvents({
  click(e) {
    // Delay cleanup only if the form is visibly open
    if (activeTool === "feedback" && showForm) {
      const popup = document.querySelector(".leaflet-popup");
      if (!popup || !popup.contains(e.originalEvent.target)) {
        setShowForm(false);
        setActiveTool(null);
      }
    }
  }
});

  if (activeTool !== "feedback" || !showForm) return null;

  return (
    <Popup position={[48.1351, 11.5820]} closeButton={false}>
      {activeTool === "feedback" && showForm ? (
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "270px" }}>
        <h4>Submit Feedback</h4>

        <label>Category</label>
        <select name="category" value={formValues.category} onChange={handleChange}>
          <option>General Feedback</option>
          <option>Safety Concern</option>
          <option>Lighting Issue</option>
          <option>Infrastructure Issue</option>
          <option>Accessibility Concern</option>
          <option>Noise / Disturbance</option>
          <option>App Feedback</option>
          <option>Other</option>
        </select>

        <label>Location Description (optional)</label>
        <input
          type="text"
          name="locationDescription"
          value={formValues.locationDescription}
          onChange={handleChange}
          placeholder="e.g., Entrance of Westpark near Gollierstraße"
        />

        <label>Time of Incident (optional)</label>
        <input
          type="datetime-local"
          name="timeOfIncident"
          value={formValues.timeOfIncident}
          onChange={handleChange}
        />

        <label>Severity</label>
        <select name="severity" value={formValues.severity} onChange={handleChange}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          rows={4}
          required
          placeholder="Describe what happened or your suggestion..."
          value={formValues.description}
          onChange={handleChange}
        />

        <label>Name (optional)</label>
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={handleChange}
        />

        <label>Email (optional)</label>
        <input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />

        <button type="submit" style={{ marginTop: "10px" }}>Submit Feedback</button>
      </form>
       ) : null}
    </Popup>
  );
}

export default FeedbackTool;
