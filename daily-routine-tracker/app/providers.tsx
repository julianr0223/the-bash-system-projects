"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRoutines } from "@/hooks/useRoutines";
import { useCompletions } from "@/hooks/useCompletions";
import { Navigation } from "@/components/Navigation/Navigation";
import { MigrationBanner } from "@/components/MigrationBanner";
import { AuthForm } from "@/components/Auth/LoginForm";
import { ChangePasswordForm } from "@/components/Auth/ChangePasswordForm";
import { VersionBadge } from "@/components/VersionBadge";
import { createContext, useContext } from "react";
import type { Routine, CompletionRecord } from "@/types";

interface AppContextValue {
  routines: Routine[];
  completions: CompletionRecord[];
  create: (data: Partial<Routine>) => Promise<void>;
  update: (id: string, data: Partial<Routine>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  toggleCompletion: (routineId: string) => Promise<void>;
  isCompletedToday: (routineId: string) => boolean;
  getCompletionsByRoutine: (routineId: string) => CompletionRecord[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within Providers");
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const { state, error, login, changePassword, logout } = useAuth();

  if (state === "loading") {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100dvh", fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}>Cargando...</div>;
  }

  if (state === "login") {
    return <AuthForm title="Iniciar sesion" buttonText="Entrar" onSubmit={login} error={error} />;
  }

  if (state === "must-change-password") {
    return <ChangePasswordForm onSubmit={changePassword} error={error} />;
  }

  return <AuthenticatedShell onLogout={logout}>{children}</AuthenticatedShell>;
}

function AuthenticatedShell({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const { routines, create, update, remove, toggleActive } = useRoutines();
  const { completions, toggleCompletion, isCompletedToday, getCompletionsByRoutine } = useCompletions();

  return (
    <AppContext.Provider value={{ routines, completions, create, update, remove, toggleActive, toggleCompletion, isCompletedToday, getCompletionsByRoutine }}>
      <Navigation onLogout={onLogout} />
      <MigrationBanner />
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "var(--space-6) var(--space-4) calc(var(--space-6) + var(--bottom-nav-height))" }}>
        {children}
      </main>
      <VersionBadge />
    </AppContext.Provider>
  );
}
