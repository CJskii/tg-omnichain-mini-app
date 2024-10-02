"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

interface QueryParamsContextType {
  botName: string | null;
  uid: string | null;
  setBotName: (botName: string) => void;
  setUid: (uid: string) => void;
}

const QueryParamsContext = createContext<QueryParamsContextType | undefined>(
  undefined
);

export function QueryParamsProvider({ children }: { children: ReactNode }) {
  const [botName, setBotName] = useState<string | null>("OmniTransferBot");
  const [uid, setUid] = useState<string | null>("123456789");

  const searchParams = useSearchParams();

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

export function useQueryParams() {
  const context = useContext(QueryParamsContext);
  if (!context) {
    throw new Error("useQueryParams must be used within a QueryParamsProvider");
  }
  return context;
}
