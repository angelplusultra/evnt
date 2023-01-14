import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Box,
} from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import endpoints, { api, domain } from "../api/api";
import { useNavigate } from "react-router-dom";


function EventCard({ host, title, location, id }) {
console.log(host)
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
// not fetching each host data ?????
  const { data, error, isLoading } = useQuery({
    queryKey: ["getUsername", host],
    queryFn: () =>
      api.query(user).get(api.endpoints.getSingleUser + host).then((res) => res.data),
  });


  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return console.log(error);
  }
  if (data) {
    return (
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'left', gap: 1 }}>
            <Avatar sx={{ bgcolor: "secondary", height: 40, width: 40 }}
              alt="Remy Sharp"
              src="../../
      public/nopic.jpg"
            >
              {data.username.charAt(0)}
            </Avatar>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {data.username}
          </Typography>
          </Box>

          
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {location.city}
          </Typography>
          <Typography variant="body2">Description</Typography>
        </CardContent>
        <CardActions>
          <Button onClick={() => navigate(`/event/${id}`, {state: data})  } size="small">See Event</Button>
        </CardActions>
      </Card>
    );
  }
}

export default EventCard;
