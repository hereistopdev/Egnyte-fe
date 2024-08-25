import React, { createContext, useContext, useState, ReactNode } from "react";
// Define the shape of the global state
interface GlobalState {
  isConnected: boolean;
  token: string | null;
  setIsConnected: (value: boolean) => void;
  setToken: (token: string | null) => void;
}

// Create the context with default values
const GlobalContext = createContext<GlobalState | undefined>(undefined);

// Create a provider component
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  return (
    <GlobalContext.Provider
      value={{ isConnected, token, setIsConnected, setToken }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global state
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  // Ensure the context is being used within a provider
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }

  return context;
};
