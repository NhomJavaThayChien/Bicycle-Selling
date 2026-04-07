import { createContext, useCallback, useMemo, useState } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const parseStoredUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const mapAuthPayloadToUser = (payload) => ({
  userId: payload.userId,
  username: payload.username,
  email: payload.email,
  role: payload.role,
});

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(parseStoredUser);

  const saveSession = useCallback((payload) => {
    if (!payload?.token) {
      throw new Error('Token không tồn tại trong phản hồi từ server.');
    }

    const sessionUser = mapAuthPayloadToUser(payload);
    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    setToken(payload.token);
    setUser(sessionUser);
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    saveSession(response.data);
    return response.data;
  }, [saveSession]);

  const register = useCallback(async (payload) => {
    const response = await authService.register(payload);
    saveSession(response.data);
    return response.data;
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
