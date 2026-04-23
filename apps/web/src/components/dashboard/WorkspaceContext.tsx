"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { RouterOutputs } from "@/utils/trpc";

type DashboardData = RouterOutputs["dashboard"]["getData"];

interface WorkspaceContextType {
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onShareLink?: () => void;
  onCompleteStep?: (step: string) => Promise<void>;
  data?: DashboardData | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({
  children,
  activeWorkspaceId,
  setActiveWorkspaceId,
  isModalOpen,
  setIsModalOpen,
  onShareLink,
  onCompleteStep,
  data,
}: {
  children: ReactNode;
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onShareLink?: () => void;
  onCompleteStep?: (step: string) => Promise<void>;
  data?: DashboardData | null;
}) {
  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspaceId,
        setActiveWorkspaceId,
        isModalOpen,
        setIsModalOpen,
        onShareLink,
        onCompleteStep,
        data,
      }}
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
