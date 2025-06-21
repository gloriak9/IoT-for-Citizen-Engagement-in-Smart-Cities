import { createContext, useContext, useState } from "react";

const ToolContext = createContext();

export function ToolProvider({ children }) {
  const [activeTool, setActiveTool] = useState(null); // "comment", "lighting", etc
  const [pins, setPins] = useState([]);

  function addPin(pin) {
    setPins((prevPins) => [...prevPins, pin]);
  }

  const value = {
    activeTool,
    setActiveTool,
    pins,
    addPin,
  };

  return (
    <ToolContext.Provider value={value}>
      {children}
    </ToolContext.Provider>
  );
}

export function useToolContext() {
  return useContext(ToolContext);
}
