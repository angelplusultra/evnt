import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import { useUser } from "../../context/userContext";
import { Typography } from "@mui/material";

function EventCard({ id }) {
  const { user: token } = useUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["getSingleEvent", id],
    queryFn: () => api.query(token).get(api.endpoints.getSingleEvent + id),
  });

  if (error) {
    return <>{error.response.data.message}</>;
  }

  return <Typography>{data?.data.title}</Typography>;
}

export default EventCard;
