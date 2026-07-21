'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdminContextValue {
  isAdmin: boolean;
  unlock: (password: string) => boolean;
  lock: () => void;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  unlock: () => false,
  lock: () => {},
});

const ADMIN_PASSWORD = 'Admin123456';
const STORAGE_KEY = 'ws_admin';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === '1') setIsAdmin(true);
  }, []);

  const unlock = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
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
