import {
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from "@mui/material";
import { Container } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import sloth from "../assets/sloth.png";
import uber from "../assets/uber.png";
import airbnb from "../assets/airbnb.png";
import boiler from "../assets/boiler.png";
import spotify from "../assets/spotify.png";

const Landing = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar
            sx={{
              mx: { md: 10 },
            }}
          >
            <Box component="div" sx={{ flexGrow: 1 }}>
              <img width={"auto"} height={80} src={sloth} />
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <Button
                  sx={{
                    borderRadius: 10,
                  }}
                  variant="contained"
                  color="secondary"
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Container>
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-evenly",
            flexDirection: { xs: "column", lg: "row" },
            mt: 20,
            gap: 30,
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: {
              xs: 'center', lg: 'start'
            },
            alignSelf: 'center'  
          }}>
            <Typography variant="h3">
              Connect your community today with the world's leading social media
              application
            </Typography>
            <Button
    size="large"
              sx={{
                mt: 5,
                // width: 100,
              }}
              variant="contained"
            >
              Sign Up
            </Button>
          </Box>
          <Box bgcolor={"black"}>
            <img width={300} src={sloth} />
          </Box>
        </Box>

        <Box
          sx={{
            mt: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              fontWeight: 100,
            }}
            variant="h3"
          >
            Endorsed by thousands of establishments
          </Typography>
          <Typography
            sx={{
              fontSize: 20,
            }}
          >
            Powered by the world's leading tech organizations
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 5,
            gap: 5,
          }}
        >
          <img width={80} src={uber} />
          <img width={80} src={airbnb} />
          <img width={80} src={boiler} />
          <img width={80} src={spotify} />
        </Box>
      </Container>
    </>
  );
};

export default Landing;
