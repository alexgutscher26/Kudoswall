"use client";

import { createContext, useContext, type ReactNode } from "react";

interface WorkspaceContextType {
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({
  children,
  activeWorkspaceId,
  setActiveWorkspaceId,
  isModalOpen,
  setIsModalOpen,
}: {
  children: ReactNode;
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) {
  return (
    <WorkspaceContext.Provider
      value={{ activeWorkspaceId, setActiveWorkspaceId, isModalOpen, setIsModalOpen }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
