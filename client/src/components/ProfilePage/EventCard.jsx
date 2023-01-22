import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import { useUser } from "../../context/userContext";
import { Box, Typography, Button } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
function EventCard({ id }) {
  const { user: token } = useUser();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["getSingleEvent", id],
    queryFn: () => api.query(token).get(api.endpoints.getSingleEvent + id),
  });

  const formattedDate = moment(data?.date).format("MMMM Do YYYY, h:mm a");
  if (error) {
    return <>{error.response.data.message}</>;
  }

  return (
    <Box
    borderRadius={5}
      padding={3}
      boxShadow={2}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      width={500}
    >
      <Typography color="blue" variant="h5">
        {data?.data.title}
      </Typography>
      <Typography color="tan" variant="h6">
        Genre
      </Typography>
      <Typography color="brown">{data?.data.genre}</Typography>
      <Typography color="red" variant="h6">
        Location
      </Typography>
      <Typography color="green">{data?.data.location.city}, {data?.data.location.state} </Typography>
      
      <Typography color="purple" variant="h6">
        Date
      </Typography>
      <Typography color="orange">{formattedDate}</Typography>
      <Button
        onClick={() => navigate(`/events/${data?.data._id}`)}
        variant="contained"
      >
        See Event
      </Button>
    </Box>
  );
}

export default EventCard;
