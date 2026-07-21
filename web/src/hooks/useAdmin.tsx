'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdminContextValue {
  isAdmin: boolean;
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  unlock: async () => false,
  lock: () => {},
});

const STORAGE_KEY = 'ws_admin';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === '1') setIsAdmin(true);
  }, []);

  const unlock = useCallback(async (password: string) => {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      localStorage.setItem(STORAGE_KEY, '1');
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, unlock, lock }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
