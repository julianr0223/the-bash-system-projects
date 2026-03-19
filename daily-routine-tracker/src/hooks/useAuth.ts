import { useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth';
import { getToken, clearToken } from '../api/client';

type AuthState = 'loading' | 'needs-setup' | 'login' | 'authenticated';

export function useAuth() {
  const [state, setState] = useState<AuthState>('loading');
  const [error, setError] = useState('');

  const checkAuth = useCallback(async () => {
    setState('loading');
    try {
      const token = getToken();
      if (token) {
        await authApi.getMe();
        setState('authenticated');
        return;
      }
    } catch {
      clearToken();
    }
    try {
      const { needsSetup } = await authApi.getStatus();
      setState(needsSetup ? 'needs-setup' : 'login');
    } catch {
      setState('login');
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const setup = useCallback(async (email: string, password: string) => {
    setError('');
    try {
      await authApi.setup(email, password);
      setState('authenticated');
    } catch (e: any) {
      setError(e.message || 'Error en setup');
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError('');
    try {
      await authApi.login(email, password);
      setState('authenticated');
    } catch (e: any) {
      setError(e.message || 'Credenciales invalidas');
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setState('login');
  }, []);

  return { state, error, setup, login, logout };
}
