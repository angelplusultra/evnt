import {
  useOutletContext,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ImageList, ImageListItem, Container, Box } from "@mui/material";
import { useUser } from "../../context/userContext";

const Gallery = () => {
  const { id } = useParams();
  const { user, userDetails, refetch } = useUser();

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
    <>
			<Container>
       <Box height='100vh' display={'flex'} alignItems='center' justifyContent={'center'}>
				<ImageList rowHeight={300} cols={3} sx={{
								height: 600,
								width: 1000
						}}>
								{userDetails.images.profileImages.map(image => (
										<ImageListItem  width={100}>
												<img width={1000} src={image.imagePath} />
														
										</ImageListItem>
								))}
						</ImageList>
      </Box>
	  </Container>
    </>
  );
};

export default Gallery;
