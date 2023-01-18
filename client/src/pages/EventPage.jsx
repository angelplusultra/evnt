//TODO : MARK ATTENDANCE BUTTON

//todo
// 1. get user state of attendance and store in state (goping, maybe, or unmarked)

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
  List,
  ListItem,
  ListItemText,
  ButtonGroup,
} from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import LoadingButton from '@mui/lab/LoadingButton';

const EventPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, userDetails } = useContext(UserContext);
  const [attendanceState, setAttendanceState] = useState(false);


  //@ Get single event data
  const {
    data: eventData,
    error: eventFetchError,
    isLoading: eventFetchisLoading,
    isFetched: eventIsFetched,
    refetch,
  } = useQuery({
    queryKey: ["getsingleevent", id],
    refetchOnWindowFocus: false,
    queryFn: () =>
      api
        .query(user)
        .get(api.endpoints.getSingleEvent + id)
        .then((res) => res.data),
  });


  const userIsGoing = eventData?.attendance.find(
    (attendee) => attendee.user === userDetails._id
  );

  useEffect(() => {
    if (userIsGoing) {
      setAttendanceState(userIsGoing.status);
    }
  }, [userIsGoing]);

  //@ Get host data from event, this fetch is dependent on the event fetch, look at the enabled property
  //@   https://daily-dev-tips.com/posts/dependant-queries-in-react-query/

  const {
    data: hostData,
    error,
    isLoading,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["getUsername", id],
    queryFn: () =>
      api
        .query(user)
        .get(api.endpoints.getSingleUser + eventData.host)
        .then((res) => res.data),

    enabled: eventData?._id !== undefined,
  });

  const {
    mutate: markAttendance,
    isLoading: markAttendanceLoading,
  } = useMutation({
    mutationKey: ["markAttendance", id],
    mutationFn: (data) =>
      api
        .query(user)
        .put(api.endpoints.markAttendance + id + "/attend", {
          status: data,
        })
        .then((res) => res.data),
    enabled: false,
    onMutate: (data) => {
      toast.info(`Marking your attendance as ${data}`);
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
      setAttendanceState(data.status);
      refetch();
    }
  });
  const {
    mutate: deleteAttendance,
    
  } = useMutation({
    mutationKey: ["deleteAttendance", id],
    mutationFn: (data) =>
      api
        .query(user)
        .delete(api.endpoints.markAttendance + id + "/attend")
        .then((res) => res.data),
    enabled: false,
    onSuccess: () => {
      refetch()
    }
  });

  if (eventFetchError) {
    console.log(eventIsFetched);
    return navigate("/dashboard", {
      state: { error: eventFetchError.response.data.message },
    });
  }
  if (isLoading || isFetching) {
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
  if (error) {
    return <h1>{error.response.data.message}</h1>;
  }

  function handleAttendanceClick({ status, dlt }) {
    if (dlt) {
      deleteAttendance();
      setAttendanceState(false);
      toast.success(`You deleted your attendance`);
      return;
    }
    markAttendance(status);
    
  }

  

  //format date

  const formattedDate = moment(eventData.date).format("MMMM Do YYYY, h:mm a");

  //check if user is going


function ButtonContent({attendType}){
  if(markAttendanceLoading){
    return(
      <CircularProgress size="10rem" />
    )
  }
  return attendType

}

  
  return (
    <Container>
      <Typography variant="h2">{eventData?.title}</Typography>
      <Typography variant="body1">
        Hosted by {hostData && hostData.username}
      </Typography>
      <Typography variant="h4">Date</Typography>
      <Typography>{formattedDate}</Typography>
      <Typography variant="h4">Location</Typography>
      <Typography>{eventData.location.address}</Typography>
      <Typography>{eventData.location.city}</Typography>
      <Typography>{eventData.location.zipCode}</Typography>
      <Typography>{eventData.location.city}</Typography>
      <Typography variant="h4">Genre</Typography>
      <Typography>{eventData.genre}</Typography>
      <Typography variant="h4">Lineup</Typography>
      <List>
        {eventData.lineup.map((artist) => (
          <ListItem>
            <ListItemText>{artist}</ListItemText>
          </ListItem>
        ))}
      </List>
      <Typography variant="h4">Attendance</Typography>
      <List>
        {eventData.attendance.map((user) => (
          <ListItem>
            <ListItemText>{user.user}</ListItemText>
          </ListItem>
        ))}
      </List>
      {attendanceState && (
        <Typography variant="h4">
          You marked your attendance as {attendanceState}
        </Typography>
      )}
      <ButtonGroup variant="contained">
        {attendanceState ? (
          <LoadingButton variant="contained" loading={markAttendanceLoading} onClick={() => handleAttendanceClick({dlt: true})}>Leave Event</LoadingButton>
        ) : (
          <>
            <LoadingButton variant="contained" loading={markAttendanceLoading} onClick={() => handleAttendanceClick({status: "going"})}>
              Going
            </LoadingButton>
            <LoadingButton variant="contained" loading={markAttendanceLoading} onClick={() => handleAttendanceClick({status: "maybe"})}>
              Maybe
            </LoadingButton>
          </>
        )}
      </ButtonGroup>
    </Container>
  );
};

export default EventPage;
