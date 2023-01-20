import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/api";



export const useGetUser = ({token, userId, retry, enable}) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => api.query(token).get(api.endpoints.getSingleUser + userId).then(res => res.data),
        retry: retry || 3,
        enabled: enable
    });
    
    return { data, isLoading, error, refetch };
    }

