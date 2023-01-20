import { useParams, Outlet, Navigate } from "react-router-dom";
import mongoose from "mongoose";
import { useGetUser } from "../../utils/use";
import { useUser } from "../../context/userContext";
import { api } from "../../api/api";
import { useEffect } from "react";
import { useUserValidate } from "../../hooks/useUserValidate";
import { useQuery } from "@tanstack/react-query";


function ValidateUser() {
  // validate params od
  const { id } = useParams();
  const { user } = useUser();

    const { error: userValidationError } = useUserValidate({id})
    
    const { data, isLoading, error } = useQuery({
        queryFn: () => api.query(user).get(api.endpoints.getSingleUser + id).then(res => res.data),
        enabled: !userValidationError,
         retry: false,
         queryKey: ['getSingleUser', id]
    });


    if(userValidationError){
        return <Navigate to='/dashboard' />
    }
    
    // get user data not working because of condiitional call


 if(isLoading){
    return <>Loading...</>
 }
 if(error){
    return <Navigate to='/dashboard' />
 }

 return <Outlet context={{userData: data}} />
}

export default ValidateUser;
