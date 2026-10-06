import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * Robust base64 JWT payload decoder that handles Unicode strings.
 */
function decodeJwtPayload(token) {
  try {
    if (!token || typeof token !== 'string' || !token.includes('.')) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token') || null);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('user_role') || 'PET_OWNER');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Extract First Name from JWT token or fallback profile
  const [firstName, setFirstName] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.first_name) return parsed.first_name;
        if (parsed.full_name) return parsed.full_name.split(' ')[0];
      } catch {}
    }
    const currentToken = localStorage.getItem('access_token');
    if (currentToken) {
      const decoded = decodeJwtPayload(currentToken);
      if (decoded?.full_name) return decoded.full_name.split(' ')[0];
      if (decoded?.first_name) return decoded.first_name;
      if (decoded?.username) return decoded.username;
    }
    return 'Pooja';
  });

  // Keep state synchronized with JWT and local storage
  useEffect(() => {
    if (token) {
      const decoded = decodeJwtPayload(token);
      if (decoded) {
        if (decoded.role) {
          setUserRole(decoded.role);
          localStorage.setItem('user_role', decoded.role);
        }
        const extracted =
          decoded.first_name ||
          (decoded.full_name ? decoded.full_name.split(' ')[0] : null) ||
          decoded.username ||
          'Pooja';
        setFirstName(extracted);
      }
    }
  }, [token]);

  const login = (accessToken, refreshToken, userData = null) => {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    setToken(accessToken);

    const decoded = decodeJwtPayload(accessToken);
    const resolvedRole = userData?.role || decoded?.role || 'PET_OWNER';
    setUserRole(resolvedRole);
    localStorage.setItem('user_role', resolvedRole);

    const fullProfile = userData || {
      id: decoded?.user_id || 1,
      email: decoded?.email || 'pooja@example.com',
      full_name: decoded?.full_name || 'Pooja Sharma',
      first_name: decoded?.first_name || 'Pooja',
      role: resolvedRole,
      city: 'Jamshedpur',
    };

    setUser(fullProfile);
    localStorage.setItem('user_profile', JSON.stringify(fullProfile));

    const fName =
      fullProfile.first_name ||
      (fullProfile.full_name ? fullProfile.full_name.split(' ')[0] : 'Pooja');
    setFirstName(fName);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_profile');
    setToken(null);
    setUserRole('PET_OWNER');
    setUser(null);
    setFirstName('Pet Parent');
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('user_profile', JSON.stringify(updated));
      if (updated.first_name) {
        setFirstName(updated.first_name);
      } else if (updated.full_name) {
        setFirstName(updated.full_name.split(' ')[0]);
      }
      return updated;
    });
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        userRole,
        user,
        firstName,
        isAuthenticated,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
