import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext.js";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import Bashboard from "./dashboard/Dashboard.js";

const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  console.log(user);
  const { data, isLoading, error } = useQuery({
    queryKey: ["getDashboard"],
    queryFn: () => api.query(user).get(api.endpoints.getAllEvents),
  });

  //! if somebody uses a fake token, they will be redirected to login page

  useEffect(() => {
    if (error) {
      console.log(error.response);
      toast.error("Something went wrong. Please try again.");
      //delete the token from local storage
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  }, [error, navigate]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (data) {
    return <Bashboard data={data.data} />;
  }
};

export default Dashboard;
