import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Select, MenuItem } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import schemas from "../validation/schemas";
import endpoints, { domain } from "../endpoints";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import places from "../data/counties_list.json";
import { useNavigate, NavLink } from "react-router-dom";
import { FormControl, InputLabel } from "@mui/material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide({ user }) {
  const navigate = useNavigate();
  if (user !== null) {
    navigate("/dashboard");
  }
  const format = places.map((county) => {
    return county.State;
  });
  const unique = [...new Set(format)];

  const [selectedState, setSelectedState] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: yupResolver(schemas.signUpSchema),
  });

  const counties = places.filter((place) => {
    if (place.State === selectedState) {
      return place.County;
    }
  });
  console.log(errors);
  const testSubmit = (data) => {
    console.log(data);
  };

  async function onSubmit(data) {
    setLoading(true);

    const id = toast.loading("Signing up...");

    // validate the form data
    // if valid, send the data to the server
    // if invalid, display the errors
    try {
      const res = await axios({
        method: "post",
        url: `${domain}${endpoints.signUp}`,
        data: {
          ...data,
          areaCode: "12345",
          isArtist: false,
        },
        withCredentials: true,
      });
      setLoading(false);

      navigate("/login", { state: res.data.message });
      toast.update(id, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        theme: "colored",
        position: "top-right",
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.update(id, {
        render: error.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        theme: "colored",
        position: "top-right",
      });
    }
  }

  function handleStateMenuChange(event) {
    setSelectedState(event.target.value);
  }

  function handleCountyMenuChange(event) {
    setSelectedCounty(event.target.value);
    console.log(selectedCounty);
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random/?event)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={errors.email ? true : false}
                helperText={errors.email?.message}
                {...register("email")}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                error={errors.username ? true : false}
                helperText={errors.username?.message}
                {...register("username")}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={errors.password ? true : false}
                helperText={errors.password?.message}
                {...register("password")}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password"
                id="password2"
                autoComplete="current-password"
                error={errors.password2 ? true : false}
                helperText={errors.password2?.message}
                {...register("password2")}
              />

              <TextField
                label="State"
                required
                select
                value={selectedState}
                onChange={handleStateMenuChange}
                fullWidth
              >
                {unique.map((state, i) => (
                  <MenuItem key={i} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>

              {selectedState && (
                <>
                  <TextField
                    select
                    label="County"
                    margin="dense"
                    fullWidth
                    error={errors.locationTracking ? true : false}
                    helperText={errors.locationTracking?.message}
                    {...register("locationTracking.0")}
                  >
                    {counties.map((county, i) => (
                      <MenuItem key={i} value={county.County}>
                        {county.County}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                  <NavLink to="/registerartist">
                    {"Looking to Sign Up as an Artist"}
                  </NavLink>
                </Grid>
                <Grid item>
                  <NavLink to="/login">
                    {"Already have an account? Sign In"}
                  </NavLink>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
