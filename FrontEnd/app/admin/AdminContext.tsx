"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface AdminContextType {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <AdminContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error(
      "useAdminContext must be used within an AdminContextProvider",
    );
  }
  return context;
}
