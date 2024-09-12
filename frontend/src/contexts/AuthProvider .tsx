import React, { createContext, ReactNode, useContext, useState } from "react";


interface AuthContextType {
    isAuthenticated: boolean;
    login: (userToken: string) => void;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface IAuthProps {
    children: ReactNode;
  }

  type AuthToken = string;
  
export const AuthProvider = ({ children }: IAuthProps) => {
    const [token, setToken] = useState<AuthToken | null>(null);
    const login = (userToken: string) => {
      setToken(userToken);
    };
    const logout = () => {
      setToken(null);
    };
    const isAuthenticated = !!token;
    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };