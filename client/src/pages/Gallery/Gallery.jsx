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
} from "@mui/material";
import { useUser } from "../../context/userContext";
import { useState } from "react";
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
 const [open, setOpen] = useState();
 const [imageState, setImageState] = useState();
 const handleOpen = ({ image }) => {
  setOpen(true);
  setImageState(image);
 };
 const handleClose = () => setOpen(false);
 if (id) {
  if (id === userDetails._id) return <Navigate to="/profile/gallery" replace />;

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
   >
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
       <img onClick={() => handleOpen({ image })} src={image.imagePath} />
      </ImageListItem>
     ))}
     <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
       <Typography>Make Profile Image?</Typography>
       <img width={100} src={imageState?.imagePath} />
      </Box>
     </Modal>
    </ImageList>
   </Box>
  </Container>
 );
};

export default Gallery;
