import { apiFetch, setToken, clearToken } from './client';

interface AuthResponse {
  token: string;
  user: { id: number; email: string };
  mustChangePassword?: boolean;
}

interface StatusResponse {
  needsSetup: boolean;
}

interface MeResponse {
  user: { id: number; email: string };
  mustChangePassword: boolean;
}

export async function getStatus(): Promise<StatusResponse> {
  return apiFetch('/api/auth/status');
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function getMe(): Promise<MeResponse> {
  return apiFetch('/api/auth/me');
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
  return apiFetch('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function logout(): void {
  clearToken();
}
