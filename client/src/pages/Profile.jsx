import { Navigate, useParams } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useOutletContext } from "react-router-dom";
import { Typography, Container } from "@mui/material";
import EventCard from "../components/ProfilePage/EventCard";
import User from "../components/User";



function ProfilePage() {
  const userData = useOutletContext();
  const { id } = useParams();

  const { userDetails } = useUser();



  // Other user data
  if (id) {
    if(id === userDetails._id) return <Navigate to='/profile' replace />
    return (
      <Container>
        <Typography variant="h4">{userData.userData.username}</Typography>
        <Typography variant="h3">
          {userData.userData.attendingEvents.map((event) => (
            <EventCard id={event.event} key={event._id} />
          ))}
        </Typography>
        <Typography variant="h3">Hosting Events</Typography>
        {userData.userData.createdEvents.map((event) => (
          <EventCard id={event} />
        ))}
        <Typography>Following</Typography>
        {userData.userData.following.map((user, i) => (
          <User key={i} userId={user} />
        ))}

      <Typography>Followers</Typography>
      {userData.userData.followers.length > 0 ? userData.userData.followers.map((user, i) => (
        <User key={i} userId={user} />
      )) : 'No Followers :('}
       
      </Container>
    );
  }
// User Render
  return (
    <Container>
      <Typography variant="h4">{userDetails.username}</Typography>

      <Typography variant="h4">Attending Events</Typography>
      <Typography variant="h3">
        {userDetails.attendingEvents.map((event) => (
          <EventCard id={event.event} key={event._id} />
        ))}
      </Typography>
      <Typography variant="h3">Hosting Events</Typography>
      {userDetails.createdEvents.map((event) => (
        <EventCard id={event} />
      ))}
      <Typography>Following</Typography>
      {userDetails.following.map((user, i) => (
        <User key={i} userId={user} />
      ))}
 <Typography>Followers</Typography>
      {userDetails.followers.length > 0 ? userDetails.followers.map((user, i) => (
        <User key={i} userId={user} />
      )) : 'No Followers :('}
     
    </Container>
  );
}

export default ProfilePage;
