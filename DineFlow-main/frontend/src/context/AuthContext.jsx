import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getCurrentUser, setCurrentUser } from '../services/api';

const AuthContext = createContext();

export const ROLE_PERMISSIONS = {
  ADMIN: {
    title: 'System Administrator',
    stationName: 'Executive Admin Terminal',
    badgeColor: '#818cf8',
    defaultView: 'dashboard',
    allowedViews: ['dashboard', 'pos', 'orders', 'kitchen', 'tables', 'billing', 'menu', 'inventory', 'feedback', 'reports', 'users'],
    canEditMenu: true,
    canSettleBills: true,
    canManageTables: true,
    canManageUsers: true,
  },
  MANAGER: {
    title: 'General Manager',
    stationName: 'Operations Manager Desk',
    badgeColor: '#38bdf8',
    defaultView: 'dashboard',
    allowedViews: ['dashboard', 'pos', 'orders', 'kitchen', 'tables', 'billing', 'menu', 'inventory', 'feedback', 'reports'],
    canEditMenu: true,
    canSettleBills: true,
    canManageTables: true,
    canManageUsers: false,
  },
  CHEF: {
    title: 'Head Chef',
    stationName: 'Kitchen Display Line (KDS)',
    badgeColor: '#f97316',
    defaultView: 'kitchen',
    allowedViews: ['kitchen', 'menu', 'orders', 'inventory'],
    canEditMenu: true,
    canSettleBills: false,
    canManageTables: false,
    canManageUsers: false,
  },
  WAITER: {
    title: 'Floor Waiter',
    stationName: 'Server & Dining Floor Station',
    badgeColor: '#10b981',
    defaultView: 'tables',
    allowedViews: ['tables', 'pos', 'orders', 'menu', 'feedback'],
    canEditMenu: false,
    canSettleBills: false,
    canManageTables: true,
    canManageUsers: false,
  },
  CASHIER: {
    title: 'Billing Cashier',
    stationName: 'Cashier & Settlement Counter',
    badgeColor: '#eab308',
    defaultView: 'billing',
    allowedViews: ['billing', 'orders', 'reports'],
    canEditMenu: false,
    canSettleBills: true,
    canManageTables: false,
    canManageUsers: false,
  },
};

export const PRESET_ACCOUNTS = [
  { role: 'ADMIN', email: 'admin@dineflow.com', name: 'System Administrator', title: 'System Admin' },
  { role: 'MANAGER', email: 'manager@dineflow.com', name: 'General Manager', title: 'General Manager' },
  { role: 'CHEF', email: 'chef@dineflow.com', name: 'Head Chef', title: 'Head Chef' },
  { role: 'WAITER', email: 'waiter@dineflow.com', name: 'Floor Waiter', title: 'Floor Waiter' },
  { role: 'CASHIER', email: 'cashier@dineflow.com', name: 'Billing Cashier', title: 'Billing Cashier' },
];

export function isViewAllowedForRole(role, viewId) {
  const normalizedRole = (role || 'ADMIN').toUpperCase();
  const perms = ROLE_PERMISSIONS[normalizedRole] || ROLE_PERMISSIONS.ADMIN;
  return perms.allowedViews.includes(viewId);
}

export function getDefaultViewForRole(role) {
  const normalizedRole = (role || 'ADMIN').toUpperCase();
  const perms = ROLE_PERMISSIONS[normalizedRole] || ROLE_PERMISSIONS.ADMIN;
  return perms.defaultView || 'dashboard';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser());
  const [backendStatus, setBackendStatus] = useState({ online: false, latency: null, dbName: '' });

  const checkHealth = async () => {
    try {
      const start = performance.now();
      const res = await api.health();
      const latency = Math.round(performance.now() - start);
      if (res && (res.status === 'healthy' || res.database)) {
        setBackendStatus({ online: true, latency, dbName: res.database_name || 'restaurant_management' });
      } else {
        setBackendStatus({ online: true, latency, dbName: '' });
      }
    } catch {
      setBackendStatus({ online: false, latency: null, dbName: '' });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 25000);
    return () => clearInterval(interval);
  }, []);

  // Start with a local admin profile so the dashboard is immediately accessible.
  useEffect(() => {
    if (!user) {
      const defaultUser = { ...PRESET_ACCOUNTS[0], id: 'local-admin' };
      setCurrentUser(defaultUser);
      setUser(defaultUser);
    }
  }, []);

  const switchRole = async (targetRole) => {
    const acc = PRESET_ACCOUNTS.find(a => a.role === targetRole);
    if (!acc) return;

    const selectedUser = { ...acc, id: `local-${targetRole.toLowerCase()}` };
    setCurrentUser(selectedUser);
    setUser(selectedUser);
    return selectedUser;
  };

  const login = async (email, password) => {
    const authenticatedUser = await api.auth.login(email, password);
    setCurrentUser(authenticatedUser);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  const normalizedRole = (user?.role || 'ADMIN').toUpperCase();
  const permissions = ROLE_PERMISSIONS[normalizedRole] || ROLE_PERMISSIONS.ADMIN;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: normalizedRole,
        permissions,
        backendStatus,
        checkHealth,
        switchRole,
        isAllowed: (viewId) => isViewAllowedForRole(normalizedRole, viewId),
        defaultView: permissions.defaultView || 'dashboard',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
