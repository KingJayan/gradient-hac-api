import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/auth-context';
import * as SecureStore from 'expo-secure-store';

export interface Creds {
  hacUrl: string;
  username: string;
  password: string;
}

// returns null when the user is not logged in or password unavailable
// password fetched directly from SecureStore on-demand, never kept in memory
export function useCreds(): Creds | null {
  const ctx = useContext(AuthContext);
  const u = ctx?.state.user;
  const [password, setPassword] = useState<string | null>(null);
  
  useEffect(() => {
    if (!u) {
      setPassword(null);
      return;
    }
    SecureStore.getItemAsync('userPass').then(setPassword);
  }, [u]);

  if (!u || !password) return null;
  return { hacUrl: u.hacUrl, username: u.username, password };
}
