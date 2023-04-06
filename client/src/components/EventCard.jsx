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
  CardMedia,
  Divider,
} from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import endpoints, { api, domain } from "../api/api";
import { useNavigate } from "react-router-dom";

function EventCard({ host, title, location, id, poster }) {
  console.log(host);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  // not fetching each host data ?????
  const { data, error, isLoading } = useQuery({
    queryKey: ["getUsername", host],
    queryFn: () =>
      api
        .query(user)
        .get(api.endpoints.getSingleUser + host)
        .then((res) => res.data),
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return console.log(error);
  }
  if (data) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          boxShadow: 5,
          gap: 5,
          borderRadius: 5,
          p: 5
        }}
      >
        <Box width={300} height={300} component="img" src={poster} />

        {/* RIGHT CONTAINER */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: 'space-between',
            alignItems: 'center',
            width: 'auto',
            height: 300
          }}
        >
          {/* TITLE, LOCATION AND USER CONTAINER*/}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              width: "100%",
              p: 2,
              borderBottom: 'solid black'
              
            }}
          >
            <Typography>{title}</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography>{data.username}</Typography>
              <Avatar>A</Avatar>
            </Box>
          </Box>

          {/* DESCRIPTION, BUTTONS, LINEUP + MORE*/}
          <Box>
            <Typography>
              Lorem ipsum dolor sit amet, officia excepteur ex fugiat
              reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit
              ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
              Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet
              voluptate voluptate dolor minim nulla est proident. Nostrud
              officia pariatur ut officia.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default EventCard;
