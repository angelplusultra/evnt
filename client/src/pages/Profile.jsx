import { Navigate, useParams } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useOutletContext } from "react-router-dom";
import {
  Typography,
  Container,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import EventCard from "../components/ProfilePage/EventCard";
import User from "../components/User";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/system";
import ProfilePicModal from "../components/ProfilePicModal";

function ProfilePage() {
  const userData = useOutletContext();
  const { id } = useParams();
  const location = useLocation();
  const { userDetails, refetch, isRefetching } = useUser();
  const [loading, setLoading] = useState(true);
  const [ modalOpen, setModalOpen ] = useState(false)

  const handleOpen = () => setModalOpen(true)
  const handleClose = () => setModalOpen(false)
  //data is stale when



	//keep an eye on this
  useEffect(() => {
    if (location.pathname !== "/profile") return console.log("not refetching");

    console.log("refetching");
    refetch();
  }, [refetch]);
  // Other user data

  if (isRefetching) return <Typography>Loading...</Typography>;
	/* -----RENDER FOR OUTER USER PROFILE-------*/
  if (id) {
    if (id === userDetails._id) return <Navigate to="/profile" replace />;

    const outerUserProfileImage = userData.userData.images.profileImages.find(image  => image.selectedProfile === true)

    return (     
    <Container
	
	sx={{
		height: '100vh',
		bgcolor: ' grey',
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >

      <Box alignItems={'center'} justifyContent={'space-between'} display={"flex"}>
        <IconButton >
          <Avatar src={outerUserProfileImage}>
            {userData.userData.username[0].toUpperCase()}
          </Avatar>
        </IconButton>

        <Typography variant="h4">{userData.username}</Typography>
      </Box>

      <Typography variant="h4">Attending Events</Typography>
      <Box display={"flex"} gap={2}>
        {userData?.userData.attendingEvents?.map((event) => (
          <EventCard id={event.event} key={event._id} />
        ))}
      </Box>
      <Typography variant="h4">Hosting Events</Typography>
      <Box display={"flex"} gap={2}>
        {" "}
        {userData?.userData.createdEvents.map((event) => (
          <EventCard id={event} />
        ))}
      </Box>
      <Typography variant="h5">Following</Typography>
      {userData?.userData.following.map((user, i) => (
        <User key={i} userId={user} />
      ))}
      <Typography variant="h5">Followers</Typography>
      {userData?.userData.followers.length > 0
        ? userData.followers.map((user, i) => <User key={i} userId={user} />)
        : "No Followers :("}
      <Typography variant="h5">Locations</Typography>
      <Typography variant="h6">
        {userData?.userData.locationTracking.map((county) => county)}
      </Typography>
      <ProfilePicModal handleClose={handleClose} handleOpen={handleOpen} modalState={modalOpen} />
    </Container>
           );
  }
console.log(userDetails)
	const profileImage = userDetails
		.images
		.profileImages
		.find(image => image.selectedProfile === true)



	/* -----User Render----- */
  return (
    <Container
	
	sx={{
		height: '100vh',
		bgcolor: ' grey',
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >

      <Box alignItems={'center'} justifyContent={'space-between'} display={"flex"}>
        <IconButton onClick={handleOpen}>
          <Avatar src={profileImage.imagePath}></Avatar>
        </IconButton>

        <Typography variant="h4">{userDetails.username}</Typography>
      </Box>

      <Typography variant="h4">Attending Events</Typography>
      <Box display={"flex"} gap={2}>
        {userDetails.attendingEvents.map((event) => (
          <EventCard id={event.event} key={event._id} />
        ))}
      </Box>
      <Typography variant="h4">Hosting Events</Typography>
      <Box display={"flex"} gap={2}>
        {" "}
        {userDetails.createdEvents.map((event) => (
          <EventCard id={event} />
        ))}
      </Box>
      <Typography variant="h5">Following</Typography>
      {userDetails.following.map((user, i) => (
        <User key={i} userId={user} />
      ))}
      <Typography variant="h5">Followers</Typography>
      {userDetails.followers.length > 0
        ? userDetails.followers.map((user, i) => <User key={i} userId={user} />)
        : "No Followers :("}
      <Typography variant="h5">Locations</Typography>
      <Typography variant="h6">
        {userDetails.locationTracking.map((county) => county)}
      </Typography>
      <ProfilePicModal handleClose={handleClose} handleOpen={handleOpen} modalState={modalOpen} />
    </Container>
  );
}

export default ProfilePage;
