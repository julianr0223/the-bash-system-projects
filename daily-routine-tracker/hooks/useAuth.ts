import { useState, useEffect, useCallback } from 'react';
import * as authApi from '@/api-client/auth';
import { getToken, clearToken } from '@/api-client/client';

type AuthState = 'loading' | 'login' | 'must-change-password' | 'authenticated';

export function useAuth() {
  const [state, setState] = useState<AuthState>('loading');
  const [error, setError] = useState('');

  const checkAuth = useCallback(async () => {
    setState('loading');
    try {
      const token = getToken();
      if (token) {
        const me = await authApi.getMe();
        setState(me.mustChangePassword ? 'must-change-password' : 'authenticated');
        return;
      }
    } catch {
      clearToken();
    }
    setState('login');
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setError('');
    try {
      const data = await authApi.login(email, password);
      setState(data.mustChangePassword ? 'must-change-password' : 'authenticated');
    } catch (e: any) {
      setError(e.message || 'Credenciales invalidas');
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setError('');
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setState('authenticated');
    } catch (e: any) {
      setError(e.message || 'Error al cambiar contraseña');
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setState('login');
  }, []);

  return { state, error, login, changePassword, logout };
}
