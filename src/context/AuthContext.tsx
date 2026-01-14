import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'pharmacist' | 'doctor';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: User['role']) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('pharmavault_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    setIsLoading(true);
    
    try {
      // For demo purposes, accept any email/password with basic validation
      if (!email || !password || password.length < 6) {
        return false;
      }
      
      // Simulate delay for API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user
      const mockUser: User = {
        id: '123456',
        name: email.split('@')[0],
        email,
        role: 'patient',
      };
      
      setUser(mockUser);
      localStorage.setItem('pharmavault_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    role: User['role']
  ): Promise<boolean> => {
    // Simulate API call
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!name || !email || !password || password.length < 6) {
        return false;
      }
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user creation
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 11),
        name,
        email,
        role,
      };
      
      setUser(mockUser);
      localStorage.setItem('pharmavault_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pharmavault_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};