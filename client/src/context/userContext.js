//create user context
import { createContext, useContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
  
      console.log("🚀 ~ file: App.js:18 ~ useEffect ~ token", token);
  
      if (token !== null) {
        setUser(token);
      } else {
        setUser(null);
      }
      setLoading(false);
    }, [user]);
  
    
    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
        {children}
        </UserContext.Provider>
    );
    }