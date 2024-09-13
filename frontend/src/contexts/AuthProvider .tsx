import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getUser } from "../api";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
interface AuthContextType {
    isAuthenticated: boolean;
    login: (userName: string, password: string) => void;
    logout: () => void;
    error: string | null; // Add error state to context
    user: { id: string; name: string } | null; // Add user info to context

}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface IAuthProps {
    children: ReactNode;
}

type AuthToken = string;

export const AuthProvider = ({ children }: IAuthProps) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<AuthToken | null>(null);
    const [error, setError] = useState<string | null>(null); // Add error state
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        // Retrieve token from session storage on component mount
        const storedToken = sessionStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
          const decodedToken: any = jwtDecode(storedToken)
          setUser({ id: decodedToken.id, name: decodedToken.name });
        }
      }, []);

    const login = async (userName: string, password: string) => {
        try {
            const response = await getUser(userName, password);
            const newToken = response.token;
            setToken(newToken);
            sessionStorage.setItem('authToken', newToken); // Store token in session storage
            const decodedToken: any = jwtDecode(newToken);
            setUser({ id: decodedToken.id, name: decodedToken.name });
            navigate("/home");
          } catch (err) {
            setError('Invalid username or password'); // Set error message
          }
        };
    const logout = () => {
      sessionStorage.removeItem("authToken")
      setToken(null);
    };
    const isAuthenticated = !!token;
    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, error, user }}>
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