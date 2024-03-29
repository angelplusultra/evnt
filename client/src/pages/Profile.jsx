import { Navigate, NavLink, useParams } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useOutletContext } from "react-router-dom";
import {
  Typography,
  Container,
  Button,
  Avatar,
  IconButton,
  Divider,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  CardHeader,
} from "@mui/material";
import EventCard from "../components/ProfilePage/EventCard";
import User from "../components/User";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Box, Link } from "@mui/material";
import ProfilePicModal from "../components/ProfilePicModal";
import { useQueries } from "@tanstack/react-query";
import { api } from "../api/api";

function ProfilePage() {
  const outletContext = useOutletContext();
  const { id } = useParams();
  const location = useLocation();
  const { userDetails, refetch, isRefetching, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const attendingEventsResults = useQueries({
    queries: userDetails?.attendingEvents?.map((event) => ({
      queryKey: ["attendingEvent", event.event],
      queryFn: () =>
        api.query(user).get(api.endpoints.getSingleEvent + event.event),
    })),
  });
  const createdEventsResults = useQueries({
    queries: userDetails?.createdEvents?.map((eventId) => ({
      queryKey: ["attendingEvent", eventId],
      queryFn: () =>
        api.query(user).get(api.endpoints.getSingleEvent + eventId),
    })),
  });

console.log({ createdEventsResults })


  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  //data is stale when
  console.log(outletContext);

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

    const outerUserProfileImage =
      outletContext.userData.images.profileImages.find(
        (image) => image.selectedProfile === true
      );

    return (
      <Container
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box
          alignItems={"center"}
          justifyContent={"space-between"}
          display={"flex"}
        >
          <IconButton>
            <Avatar src={outerUserProfileImage}>
              {outletContext?.userData.username[0].toUpperCase()}
            </Avatar>
          </IconButton>

          <Typography variant="h4">
            {outletContext?.userData.username}
          </Typography>
        </Box>

        <Typography variant="h4">Attending Events</Typography>
        <Box display={"flex"} gap={2}>
          {outletContext?.userData.attendingEvents?.map((event) => (
            <EventCard id={event.event} key={event._id} />
          ))}
        </Box>
        <Typography variant="h4">Hosting Events</Typography>
        <Box display={"flex"} gap={2}>
          {" "}
          {outletContext.userData.createdEvents.map((event) => (
            <EventCard id={event} />
          ))}
        </Box>
        <Typography variant="h5">Following</Typography>
        {outletContext?.userData.following.map((user, i) => (
          <User key={i} userId={user} />
        ))}
        <Typography variant="h5">Followers</Typography>
        {outletContext?.userData.followers.length > 0
          ? outletContext.userData.followers.map((user, i) => (
              <User key={i} userId={user} />
            ))
          : "No Followers :("}
        <Typography variant="h5">Locations</Typography>
        <Typography variant="h6">
          {outletContext.userData.locationTracking.map((county) => county)}
        </Typography>
        <ProfilePicModal
          handleClose={handleClose}
          handleOpen={handleOpen}
          modalState={modalOpen}
        />
      </Container>
    );
  }
  console.log(userDetails);
  const profileImage = userDetails.images.profileImages.find(
    (image) => image.selectedProfile === true
  );

  const navLinkStyles = {
    fontSize: 5,
  };

  /* -----Player Render----- */
  return (
    <Container maxWidth="md">
      <Box
        alignItems={"center"}
        justifyContent={"space-between"}
        display={"flex"}
        mt={5}
        borderBottom="solid black thin"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton onClick={handleOpen}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
              }}
              src={profileImage?.imagePath}
            ></Avatar>
          </IconButton>

          <Typography variant="h5">{userDetails.username}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
          }}
          component={"nav"}
        >
          <Box sx={{}}>
            <Typography
              sx={{
                fontSize: 15,
              }}
              textAlign={"center"}
            >
              {userDetails.followers.length}
            </Typography>
            <Link
              sx={{
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  color: "secondary.main",
                  cursor: "pointer",
                },
              }}
            >
              Followers
            </Link>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography
              sx={{
                fontSize: 15,
              }}
              textAlign={"center"}
            >
              {userDetails.following.length}
            </Typography>
            <Link
              sx={{
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  color: "secondary.main",
                  cursor: "pointer",
                },
              }}
            >
              Following
            </Link>
          </Box>
        </Box>
      </Box>

    <Box sx={{
      my: 5,
      borderBottom: 1
    }}>
    <Typography variant="h5">Created Events</Typography>
    </Box>
      <Box>
        {userDetails.createdEvents.length > 0 &&(
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: 'space-evenly',
                flexWrap: 'wrap',
                borderRadius: 5,
                border: "black thin",
                my: 5,
                boxShadow: 1,
                p: 5
              
              }}
            >
              {createdEventsResults.length > 0 &&
                createdEventsResults?.map((result) => {
                  console.log({ result });

                  if (result.isSuccess) {
                    const { imagePath } = result.data.data.images.posters[0];
                    const { title, description, lineup } = result.data.data;
                    return (
                      <Box sx={{
                        m:1
                      }}>
                        <Card sx={{ width: 300 }}>
                          <CardMedia sx={{ height: 300 }} image={imagePath} />
                          <CardContent>
                            <Typography fontSize={15}>{title}</Typography>
                            <Divider
                              sx={{
                                my: 1,
                              }}
                            />
                          </CardContent>
                          <CardActions
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Button size="small">See Event</Button>
                          </CardActions>
                        </Card>
                      </Box>
                    );
                  }
                })}
            </Box>
          )}

        <Box>
    <Box sx={{
      borderBottom: 1
    }}>
    <Typography variant="h5">Attending Events</Typography>
    </Box>
          {userDetails.attendingEvents.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: 'space-evenly',
                flexWrap: 'wrap',
                borderRadius: 5,
                border: "black thin",
                my: 5,
                boxShadow: 1,
                p: 5
              
              }}
            >
              {attendingEventsResults.length > 0 &&
                attendingEventsResults?.map((result) => {
                  console.log({ result });

                  if (result.isSuccess) {
                    const { imagePath } = result.data.data.images.posters[0];
                    const { title, description, lineup } = result.data.data;
                    return (
                      <Box sx={{
                        m:1
                      }}>
                        <Card sx={{ width: 300 }}>
                          <CardMedia sx={{ height: 300 }} image={imagePath} />
                          <CardContent>
                            <Typography fontSize={15}>{title}</Typography>
                            <Divider
                              sx={{
                                my: 1,
                              }}
                            />
                          </CardContent>
                          <CardActions
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Button size="small">See Event</Button>
                          </CardActions>
                        </Card>
                      </Box>
                    );
                  }
                })}
            </Box>
          ) : (
            <Box>Not attending any events</Box>
          )}
        </Box>
      </Box>

      <ProfilePicModal
        handleClose={handleClose}
        handleOpen={handleOpen}
        modalState={modalOpen}
      />
    </Container>
  );
}

export default ProfilePage;
