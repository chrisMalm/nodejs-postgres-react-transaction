import {Outlet, Navigate} from "react-router-dom"
import { useAuth } from "../contexts/AuthProvider ";

export const PrivateRoutes = () => {
  // the Outlet will be the protected routes child thats will outputed 
  // see app routes 
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  };
