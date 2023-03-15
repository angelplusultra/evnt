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

const Landing = () => {
  return (
    <Container>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static" >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Evnt
            </Typography>
            <Button color="inherit">Login</Button>
            <Button color="inherit">Sign Up</Button>
          </Toolbar>
        </AppBar>
      </Box>
    <Typography>Yo</Typography>
    </Container>
  );
};

export default Landing;
