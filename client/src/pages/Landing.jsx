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
import graphic from '../assets/evnt_hero_graphic.PNG'
import {useNavigate} from 'react-router-dom'

const Landing = () => {
  const  navigate = useNavigate()
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
                <Button onClick={() => navigate('/login') }
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
      <Container sx={{
      }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexDirection: { xs: "column", lg: "row" },
            mt: 8,
              gap: {xs: 10, md: 0}
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
            <Typography sx={{
              px: {
                xs: 15,
                  md: 0
              },
              fontSize: {
                xs: 30,
                md: 50
              },
                textAlign: {
                  xs: 'center',
                  md: 'start'
                }
            }} variant="h3">
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
          <Box sx={{
            textAlign: 'center',
            width: {
              xs: 300,
              md: 700
            }
          }} component={'img'} src={graphic} />
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
                textAlign: 'center',
                mb: 3
            }}
            variant="h3"
          >
            Endorsed by thousands of establishments
          </Typography>
          <Typography
            sx={{
              fontSize: 15,
                textAlign: 'center',
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
              mb: 5,
            gap: 5,
          }}
        >
          <img color="white"width={80} src={uber} />
          <img width={80} src={airbnb} />
          <img width={80} src={boiler} />
          <img width={80} src={spotify} />
        </Box>
      </Container>
    </>
  );
};

export default Landing;
