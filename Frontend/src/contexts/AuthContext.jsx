import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * AuthContext
 *
 * Single source of truth for auth state.
 * - login()  → saves token + user to localStorage AND React state
 * - logout() → FULLY clears localStorage AND React state
 *
 * Every protected page reads from this context instead of calling
 * localStorage directly, so a logout immediately invalidates all
 * cached state without needing a browser reload.
 */

const AuthContext = createContext(null);

const readAuthFromStorage = () => {
  try {
    return {
      token: localStorage.getItem('token') || null,
      role: localStorage.getItem('role') || null,
      schoolId: localStorage.getItem('schoolId') || null,
      user: JSON.parse(localStorage.getItem('user') || 'null'),
    };
  } catch {
    return { token: null, role: null, schoolId: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readAuthFromStorage);

  /**
   * Call after a successful login API response.
   * Saves everything to both localStorage and React state.
   */
  const login = useCallback((data) => {
    const { token, role, schoolId = null, user = null, admin = null } = data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('schoolId', schoolId ?? '');
    localStorage.setItem('user', JSON.stringify(user || admin || {}));

    setAuth({ token, role, schoolId: schoolId ?? null, user: user || admin || {} });
  }, []);

  /**
   * Clears EVERYTHING — localStorage and React state.
   * All child components relying on this context will re-render
   * with null auth and must redirect to /login.
   */
  const logout = useCallback(() => {
    localStorage.clear();
    setAuth({ token: null, role: null, schoolId: null, user: null });
  }, []);

  /**
   * After school setup, the schoolId becomes available.
   * Sync it into context without a full logout/login cycle.
   */
  const updateSchoolId = useCallback((schoolId) => {
    localStorage.setItem('schoolId', schoolId ?? '');
    setAuth((prev) => ({ ...prev, schoolId: schoolId ?? null }));
  }, []);

  const isAuthenticated = Boolean(auth.token);

  return (
    <AuthContext.Provider value={{ auth, isAuthenticated, login, logout, updateSchoolId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
