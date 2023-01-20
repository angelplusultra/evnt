import { Navigate, useParams } from "react-router-dom";
import { useGetUser } from "../utils/use";
import { useUser } from "../context/userContext";
import { useOutletContext } from "react-router-dom";
import { Typography, Container } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import EventCard from "../components/ProfilePage/EventCard";
import User from "../components/User";
function ProfilePage() {
  const { userData } = useOutletContext();
  console.log(useOutletContext());

const {user: token} = useUser()

  return (
    <Container>
      <Typography variant="h4">{userData.username}</Typography>
      <Typography variant="h3">
        {userData.attendingEvents.map((event) => (
            <EventCard id={event.event} key={event._id} />
        ))}
      </Typography>
      <Typography variant="h3">Hosting Events</Typography>
      {userData.createdEvents.map(event => (
        <EventCard id={event} /> 
      ))}
      <Typography>Following</Typography>
      {userData.following.map((user, i ) => (
        <User key={i} userId={user} />
      ))}
      {/* <Typography>Followers</Typography>
       {userData.followers.map((user, i ) => (
        <User key={i} userId={user} />
      ))} */}
    </Container>
  );
}

export default ProfilePage;
