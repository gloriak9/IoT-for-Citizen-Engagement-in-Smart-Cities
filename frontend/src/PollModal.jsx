// --- Frontend: PollModal.jsx ---
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";


function PollModal({ isOpen, onClose, onSubmit, existingPoll = null }) {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  const handleConfirm = () => {
    if (!selectedOption) return alert("Please select an option.");
    console.log("Voting with:", { pollId: existingPoll._id, vote: selectedOption });


    fetch(`http://localhost:5000/api/polls/${existingPoll._id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ vote: selectedOption }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Vote submitted:", data);
    onSubmit();
  })
  .catch((err) => {
    console.error("Voting failed:", err);
    alert("Failed to submit vote.");
  });
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Vote in Poll</h2>
        <p className="mb-4 text-gray-800">{existingPoll.question}</p>
        <div className="space-y-2 mb-4">
          {existingPoll.options.map((opt, idx) => (
            <label key={idx} className="block">
              <input
                type="radio"
                name="pollOption"
                value={opt}
                checked={selectedOption === opt}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Vote
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
export default PollModal;