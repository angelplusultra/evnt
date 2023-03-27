// import { Outlet, useNavigate } from "react-router-dom";
// import {
//   AppBar,
//   Avatar,
//   IconButton,
//   Toolbar,
//   Box,
//   Button,
//   Typography,
// } from "@mui/material";
// import sloth from "../assets/sloth.png";
// import { useUser } from "../context/userContext";
//
// export function NavBar() {
//   const {
//     userDetails: { images, username },
//   } = useUser();
//
//   const profileImage = images.profileImages.find(
//     (image) => image.selectedProfile === true
//   );
//
//   const navigate = useNavigate()
//
//   return (
//     <>
//       <Box sx={{ flexGrow: 1 }}>
//         <AppBar position="static">
//           <Toolbar
//             sx={{
//               mx: { md: 10 },
//             }}
//           >
//             <Box  component="div" sx={{flexGrow: 1 }}>
//               <Box sx={{'&:hover': {cursor: 'pointer'}}}>
//               <img onClick={() => navigate('/dashboard')}  height={50} src={sloth} />
//               </Box>
//             </Box>
//             <Box
//               sx={{
//                 display: { xs: "none", md: "flex" },
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   gap: 2,
//                   justifyItems: 'center',
//                     alignItems: 'center'
//                 }}
//               >
//                 <IconButton onClick={() => navigate('/profile')}>
//                   <Avatar
//                     src={profileImage.imagePath}
//                     sx={{ width: 30, height: 30 }}
//                   >
//                     {"M"}
//                   </Avatar>
//                 </IconButton>
//                 <Typography>{username}</Typography>
//               </Box>
//             </Box>
//           </Toolbar>
//         </AppBar>
//       </Box>
//       <Outlet />
//     </>
//   );
// }
//
  //
  //
  //
  /* MATERIAL UI IMPORTS */
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {Outlet, useNavigate}from 'react-router-dom'
import {useUser} from '../context/userContext.js'
import {useState, useEffect}from 'react'
import logo from '../assets/sloth.png'
const pages = ['Home', 'Create Event', 'Activity'];
const settings = ['Profile', 'Logout']; 

export function NavBar() {
  
const {setUser, userDetails: {username, images}} = useUser()
  const profileImage = images.profileImages.find(
    (image) => image.selectedProfile === true
  );

  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
const navigateTo = (page) => {
  if(page === 'Home') return navigate('/dashboard')

  if(page === 'Create Event') return navigate('/events/create')

  if(page === 'Activity') return navigate('/activity')
}

const logout = () => {
  localStorage.removeItem('token')
  setUser(null)
  return navigate('/')
}


  return (
    <>
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
    <Box sx={{
      mr: 1,
      display: {xs: 'none', md: 'block'}
    }}>
    <img height={50} src={logo} />
    </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography onClick={() => navigateTo(page)} textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
    <Box sx={{
      mr: 1,
      display: {xs: 'block', md: 'none'},
      flexGrow: 1
    }}>
    <img height={50} src={logo} />
    </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => navigateTo(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => {

                if(setting === 'Profile'){
                  return (
                    <MenuItem onClick={() => navigate('/profile')} key={setting} >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  )
                } else if(setting === 'Logout'){
                  return (
                      <MenuItem onClick={logout} key={setting} >
                        <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>

                  )
                }

              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    <Outlet />
    </>
  );
}
