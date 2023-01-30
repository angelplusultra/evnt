import {
  useOutletContext,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  ImageList,
  Modal,
  ImageListItem,
  Container,
  Box,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { useUser } from "../../context/userContext";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/api";
import { toast } from "react-toastify";

const Gallery = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const { id } = useParams();
  const { user, userDetails, refetch } = useUser();
  const [open, setOpen] = useState(false);
  const [imageState, setImageState] = useState();



  const profileImage = userDetails.images.profileImages.find(
    (image) => image.selectedProfile === true
    );



console.log(profileImage);


  console.log(open);
  const { mutate, status, error } = useMutation({
    mutationKey: ["uploadProfilePic", userDetails._id],
    mutationFn: (data) =>
      api
        .query(user)
        .put(api.endpoints.updateProfileImage + data, { withCredentials: true })
        .then((res) => res.data),
    enabled: false,
  });
  const handleOpen = ({ image }) => {
    setOpen(true);
    setImageState(image);
  };



    console.log(userDetails);
  const handleSubmit = () => {
    const toastId = toast.loading("Updating Profile Image");
    console.log(imageState);
    mutate(imageState._id, {
      onSuccess: () => {
        toast.update(toastId, {
          render: "Profile Image Updated",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        refetch();
        setOpen(false);
      },
    });
  };

  //Todo Create form inside modal that sends image id to backend to make profile image
  const handleClose = () => setOpen(false);
  if (id) {
    if (id === userDetails._id)
      return <Navigate to="/profile/gallery" replace />;

    return (
      <Box>
        <Container>
          <ImageList></ImageList>
        </Container>
      </Box>
    );
  }

  return (
    <Container>
      <Box
        height="100vh"
        display={"flex"}
        alignItems="center"
        justifyContent={"center"}
        flexDirection={"column"}
      >
        <Box>
            <Typography variant="h3">Gallery</Typography>
            <Avatar src={profileImage.imagePath }>{userDetails.username[0].toUpperCase()}
            </Avatar>
        </Box>
        <ImageList
          rowHeight={300}
          cols={3}
          sx={{
            height: 600,
            width: 1000,
          }}
        >
          {userDetails.images.profileImages.map((image, i) => (
            <ImageListItem
              sx={{
                "&:hover": {
                  transition: "ease-in-out",
                  border: "1px solid #00FF00",
                  cursor: "pointer",
                },
              }}
              key={i}
            >
              <img
                alt="profileimage"
                onClick={() => handleOpen({ image })}
                src={image.imagePath}
              />
            </ImageListItem>
          ))}
          <Modal open={open} onClose={handleClose}>
            <Box
              display={"flex"}
              justifyContent="center"
              flexDirection={"column"}
              alignItems={"center"}
              gap={5}
              component="form"
              sx={style}
            >
              <img alt="selected" width={100} src={imageState?.imagePath} />
              <Box
                display={"flex"}
                alignItems="center"
                justifyContent={"space-evenly"}
                gap={2}
              >
                <Button variant="contained" color="error">
                  Delete Image
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                  Make Profile
                </Button>
              </Box>
            </Box>
          </Modal>
        </ImageList>
      </Box>
    </Container>
  );
};

export default Gallery;
