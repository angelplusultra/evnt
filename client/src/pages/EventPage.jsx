import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Box,
  CircularProgress,
  Container,
} from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import endpoints, { domain } from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { api } from "../api/api";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const EventPage = () => {
    const [queryState, setQueryState] = useState(false);
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [state, setState] = useState(true);
  const location = useLocation();



//@ Get single event data
  const { data, error: eventFetchError, isLoading: eventFetchisLoading, isFetched: eventIsFetched } = useQuery({
    queryKey: ["getsingleevent"],
    queryFn: () =>
      api
        .query(user)
        .get(api.endpoints.getSingleEvent + id)
        .then((res) => res.data),
  });
        console.log("🚀 ~ file: EventPage.jsx:41 ~ EventPage ~ data", data)



  //@ Get host data from event, this fetch is dependent on the event fetch, look at the enabled property 
//@   https://daily-dev-tips.com/posts/dependant-queries-in-react-query/

  const { data: host, error, isLoading, isFetched, isFetching } = useQuery({
    
    queryKey: ["getUsername"],
    queryFn: () => api.query(user).get(api.endpoints.getSingleUser + data.host).then((res) => res.data),
    enabled: eventIsFetched,
    });



  if (isLoading) {
    return (
      <Box
        height="100vh"
        justifyContent="center"
        alignItems="center"
        display="flex"
      >
        <CircularProgress size="10rem" />
      </Box>
    );
  }
 if(error){
    return <h1>{error.response.data.message}</h1>
 }
  if (isFetched) {


    const date = new Date(data.date);
    const { title, location, description } = data;
    
    
    //format date

    return (
      <Container>
        <Typography variant="h2">{data.title}</Typography>
        <Typography variant="body1">Hosted by {host && host.username}</Typography>
        <Typography>
          {date.toLocaleDateString() + date.toLocaleTimeString()}
        </Typography>
        <Typography>{data.title}</Typography>

        <Typography>{data.title}</Typography>
    
      </Container>
    );
  }
};


export default EventPage;
