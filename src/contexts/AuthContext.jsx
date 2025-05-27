import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
const API_URL = 'http://localhost:5000';
// Create auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    // Check localStorage for saved user session
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
  
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: email,
        password: password,
      });
  
      const { access_token, name } = response.data;

      const userData = {
        name,
        token: access_token,
      };
  
      localStorage.setItem('authUser', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
  
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.msg || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };


  // Logout function
  const logout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}