import { Navigate, useParams } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useOutletContext } from "react-router-dom";
import { Typography, Container } from "@mui/material";
import EventCard from "../components/ProfilePage/EventCard";
import User from "../components/User";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


function ProfilePage() {
  const userData = useOutletContext();
  const { id } = useParams();
  const location = useLocation(); 
  const { userDetails, refetch,} = useUser();
  //data is stale when
 
//? keep an eye on this
useEffect(() => {
    if(location.pathname !== '/profile') 
    return console.log('not refetching');
    
    console.log('refetching');
    refetch();
    }, [refetch]);
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
          <EventCard key={event._id} id={event} />
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
     <Typography variant="h4">
      Locations
     </Typography>
     <Typography variant="h4">
      {userDetails.locationTracking.map(county => (
        county
      ))}
     </Typography>
    </Container>
  );
}

export default ProfilePage;
