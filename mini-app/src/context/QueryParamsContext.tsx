"use client"; // Ensure this is a client-side component

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

// Define the shape of the context data
interface QueryParamsContextType {
  botName: string | null;
  uid: string | null;
  setBotName: (botName: string) => void;
  setUid: (uid: string) => void;
}

// Create the context with default values
const QueryParamsContext = createContext<QueryParamsContextType | undefined>(
  undefined
);

// Create a provider component
export function QueryParamsProvider({ children }: { children: ReactNode }) {
  const [botName, setBotName] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Initialize the context state from URL parameters on the first render
  useEffect(() => {
    const initialBotName = searchParams.get("botName");
    const initialUid = searchParams.get("uid");

    if (initialBotName) setBotName(initialBotName);
    if (initialUid) setUid(initialUid);
  }, [searchParams]);

  return (
    <QueryParamsContext.Provider value={{ botName, uid, setBotName, setUid }}>
      {children}
    </QueryParamsContext.Provider>
  );
}

// Custom hook to use the QueryParamsContext
export function useQueryParams() {
  const context = useContext(QueryParamsContext);
  if (!context) {
    throw new Error("useQueryParams must be used within a QueryParamsProvider");
  }
  return context;
}
