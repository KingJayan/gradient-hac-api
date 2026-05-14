import { useReducer, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthState, Student } from '../context/auth-context';
import { logError } from '../utils/error-logger';

type AuthAction =
  | { type: 'RESTORE_TOKEN'; payload: { token: string; user: Student } }
  | { type: 'SIGN_IN'; payload: { token: string; user: Student } }
  | { type: 'SIGN_OUT' };

const initialState: AuthState = {
  isLoading: true,
  isLoggedOut: false,
  userToken: null,
  user: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        isLoading: false,
        isLoggedOut: false,
        userToken: action.payload.token,
        user: action.payload.user,
      };
    case 'SIGN_IN':
      return {
        isLoading: false,
        isLoggedOut: false,
        userToken: action.payload.token,
        user: action.payload.user,
      };
    case 'SIGN_OUT':
      return {
        isLoading: false,
        isLoggedOut: true,
        userToken: null,
        user: null,
      };
    default:
      return state;
  }
}

export function useAuth() {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const bootstrapAsync = useCallback(async () => {
    try {
      const [token, userJson, password] = await Promise.all([
        SecureStore.getItemAsync('userToken'),
        SecureStore.getItemAsync('user'),
        SecureStore.getItemAsync('userPass'),
      ]);

      if (token && userJson && password) {
        // password stays in SecureStore, not loaded into state
        const user = JSON.parse(userJson);
        dispatch({ type: 'RESTORE_TOKEN', payload: { token, user } });
      } else {
        // missing any credential — require fresh login
        dispatch({ type: 'SIGN_OUT' });
      }
    } catch (e) {
      logError(e as Error, { action: 'bootstrapAsync' });
      dispatch({ type: 'SIGN_OUT' });
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string, hacUrl: string) => {
      const response = await fetch(
        `https://homeaccesscenterapi.vercel.app/api/name?link=${encodeURIComponent(hacUrl)}&user=${username}&pass=${password}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error('Invalid credentials');

      // generate secure random token (no PII embedded)
      const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      // password stored separately in SecureStore — not in user object
      const user = { username, hacUrl, name: data.name };

      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      await SecureStore.setItemAsync('userPass', password);

      dispatch({ type: 'SIGN_IN', payload: { token, user } });
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('user');
      await SecureStore.deleteItemAsync('userPass');
      dispatch({ type: 'SIGN_OUT' });
    } catch (e) {
      logError(e as Error, { action: 'logout' });
    }
  }, []);

  return { state, bootstrapAsync, login, logout };
}
