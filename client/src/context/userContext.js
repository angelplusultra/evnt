//create user context
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";
import { useQuery } from "@tanstack/react-query";
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
  // fetch data with query for cache and refetch cabapabiltiies, pass it down to components that might need a refetch
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token ) {
      setLoading(false);
      setUser(null);
      return;
    }
      
    setUser(token);
  }, [user]);

  const { data, isLoading, error, refetch, isRefetching } = useQuery(
    ["user"],
    () => api.query(user).get(api.endpoints.getMe),
    {
      enabled: user ? true : false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      retry: false,
      onSuccess: (data) => {
        setUserDetails(data.data);
        setLoading(false);
        setUser(user);
      },
      onError: (err) => {
        console.log(err);
        localStorage.removeItem("token");
        setLoading(false);
        setUser(null);
      },
    }
  );

  
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (token !== null) {
  //     api
  //       .query(token)
  //       .get(api.endpoints.getMe)
  //       .then((res) => {
  //         setUserDetails(res.data);
  //         setUser(token)
  //         setLoading(false);
  //       })

  //       .catch((err) => {
  //         console.log(err.response.data.message);
  //         localStorage.removeItem("token");
  //         setLoading(false)
  //         setUser(null);
  //       });

  //   } else {
  //     setUser(null);
  //     setLoading(false)
  //   }

  // }, [user]);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, userDetails, refetch, isRefetching, error }}
    >
      {children}
    </UserContext.Provider>
  );
};
