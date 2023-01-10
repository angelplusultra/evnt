import { Button, Box, TextField, FormControl, Typography, Snackbar, Alert} from "@mui/material";
import axios from 'axios';
import { useForm } from "react-hook-form";
import schemas from "../validation/schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import endpoints from "../endpoints";
import {useState} from 'react'
// create a sign up form with material ui containing 4 text fields, email, username, password, and confirm password
const SignUp = () => {
    const [error, setError] = useState(null)
    const [open, setOpen] = useState(false)
  const { register, handleSubmit, formState: {errors} } = useForm({
    resolver: yupResolver(schemas.signUpSchema),
  });

  // const [formData, setFormData] = useState({
  //     email: "",
  //     username: "",
  //     password: "",
  //     password2: "",
  // });
  // function handleChange(e) {
  //     setFormData(prevState => (
  //         {...prevState, [e.target.name]: e.target.value}
  //     ))

  // }
  async function onSubmit(data) {
    console.log(data);
    // validate the form data
    // if valid, send the data to the server
    // if invalid, display the errors
    try {
        const res = await axios({
            method: "post",
            url: endpoints.signUp,
            data: {
                ...data,
                locationTracking: ['New York'],
                areaCode: '12345',
                isArtist: false,
            },
            withCredentials: true,
        })
        console.log(res.data)
        
    } catch (error) {
        setError(error.response.data.message)


        
    }
   
  }
 

  return (
    <>
    <Snackbar open={error ? true : false} autoHideDuration={6000} onClose={() => setError(null)} message={error}>
        <Alert severity="error" sx={{ width: '100%' }}>
            {error}
        </Alert>
    </Snackbar>
     <Typography variant="h5">Sign Up</Typography>
    <Box sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }} autoComplete="off" component="form">
      
      <FormControl>
        <TextField error={errors.email ? true : false} helperText={errors.email?.message} label="Email" variant="outlined" {...register("email")} />
        <TextField
        error={errors.username ? true : false} helperText={errors.username?.message}
          label="Username"
          variant="outlined"
          {...register("username")}
        />
        <TextField
        error={errors.password ? true : false} helperText={errors.password?.message}
          type="password"
          label="Password"
          variant="outlined"
          {...register("password")}
        />
        <TextField
        error={errors.password2 ? true : false} helperText={errors.password2?.message}
          type="password"
          label="Confirm Password"
          variant="outlined"
          {...register("password2")}
        />
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </FormControl>
    </Box>
    </>
   
  );
};

export default SignUp;
<>SignUp</>;
