"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRoutines } from "@/hooks/useRoutines";
import { useCompletions } from "@/hooks/useCompletions";
import { Navigation } from "@/components/Navigation/Navigation";
import { MigrationBanner } from "@/components/MigrationBanner";
import { AuthForm } from "@/components/Auth/LoginForm";
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
  const { state, error, setup, login, logout } = useAuth();
  const { routines, create, update, remove, toggleActive } = useRoutines();
  const { completions, toggleCompletion, isCompletedToday, getCompletionsByRoutine } = useCompletions();

  if (state === "loading") {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100dvh" }}>Cargando...</div>;
  }

  if (state === "needs-setup") {
    return <AuthForm title="Crear cuenta" buttonText="Registrar" onSubmit={setup} error={error} />;
  }

  if (state === "login") {
    return <AuthForm title="Iniciar sesion" buttonText="Entrar" onSubmit={login} error={error} />;
  }

  return (
    <AppContext.Provider value={{ routines, completions, create, update, remove, toggleActive, toggleCompletion, isCompletedToday, getCompletionsByRoutine }}>
      <Navigation onLogout={logout} />
      <MigrationBanner />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem 1rem" }}>
        {children}
      </main>
    </AppContext.Provider>
  );
}
