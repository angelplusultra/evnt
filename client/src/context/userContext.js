//create user context
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";
export const UserContext = createContext();

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");


    if (token !== null) {
      api
        .query(token)
        .get(api.endpoints.getMe)
        .then((res) => {
          setUserDetails(res.data);
          setUser(token)
          setLoading(false);
        })

        .catch((err) => {
          console.log(err.response.data.message);
          localStorage.removeItem("token");
          setLoading(false)
          return setUser(null);
        });
      
    } else {
      setUser(null);
    }
   
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, userDetails }}>
      {children}
    </UserContext.Provider>
  );
};
