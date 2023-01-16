import { useForm } from "react-hook-form";
import { Container, TextField, Box, Button, FormLabel, IconButton } from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../api/api";
import { useUser } from "../context/userContext";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { Controller } from "react-hook-form";
import AddIcon from '@mui/icons-material/Add';
import { FormControl } from '@mui/material';


function CreateEvent() {
// @1 Get user from context
    const { user } = useUser();

// @2 Establish React Hook Form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();


  // @3 Establish React Query W/ mutation
  const { status, error, mutate } = useMutation({
    mutationFn: (data) => api.query(user).post(api.endpoints.createEvent, data),
  });
  function onSubmit(data) {
    mutate(data);
  }

  return (
    <Container>
      <Box display="flex" alignItems="flex-start" justifyContent='center' flexDirection='column' onSubmit={handleSubmit(data => console.log(data))} component="form">
        <TextField
          margin="normal"
          fullWidth
          id="title"
          label="Title"
          name="title"
          autoComplete="title"
          autoFocus
          error={errors.title ? true : false}
          helperText={errors.title?.message}
          {...register("title", { required: "Title is required" })}
        />
        <TextField
          margin="normal"
          fullWidth
          id="genre"
          label="Genre"
          name="genre"
          autoComplete="genre"
          autoFocus
          error={errors.genre ? true : false}
          helperText={errors.genre?.message}
          {...register("genre", { required: "Genre is required" })}
        />
        <FormLabel>Lineup</FormLabel>

            {/*Make it so when the user clicks the button it adds a new value to the lineup list  */}

        <TextField
            margin="normal"
            fullWidth
            id="lineup"
            label="Lineup"
            name="lineup"
            autoComplete="lineup"
            autoFocus
            error={errors.lineup ? true : false}
            helperText={errors.lineup?.message}
            {...register("lineup", { required: "Lineup is required" })}
        />
            <IconButton onClick={addArtistToList} aria-label="add">
                <AddIcon />
            </IconButton>
        
        <FormLabel>Location</FormLabel>
        <TextField
          margin="normal"
          fullWidth
          id="title"
          label="Address"
          name="address"
          autoComplete="address"
          autoFocus
          error={errors.location?.address ? true : false}
          helperText={errors.location?.address.message}
          {...register("location.address", { required: "Address is required" })}
        />
        <TextField
          margin="normal"
          fullWidth
          id="city"
          label="City"
          name="city"
          autoComplete="city"
          autoFocus
          error={errors.location?.city ? true : false}
          helperText={errors.location?.city.message}
          {...register("location.city", { required: "City is required" })}
        />
        <TextField
          margin="normal"
          fullWidth
          id="zipCode"
          label="Zip Code"
          name="zipCode"
          autoComplete="zipCode"
          autoFocus
          error={errors.location?.zipCode ? true : false}
          helperText={errors.location?.zipCode.message}
          {...register("location.zipCode", {
            required: "Zip Code is required",
          })}
        />
        <TextField
          margin="normal"
          fullWidth
          id="state"
          label="State"
          name="state"
          autoComplete="state"
          autoFocus
          error={errors.location?.state ? true : false}
          helperText={errors.location?.state.message}
          {...register("location.state", { required: "State is required" })}
        />
         <Controller
            name="date" 
            control={control}
            defaultValue={new Date()}
            rules={{ required: "Please select a date and time for your event", validate: (value) => value > new Date() || "Please select a date and time in the future" }}
            render={({field: { onChange, value}, fieldState: { error } }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                        label="Date"
                        inputFormat="MM/DD/YYYY hh:mm A"
                        renderInput={(params) => <TextField {...params} error={!!error} helperText={error?.message}/>}
                        value={value}
                        onChange={(e) => onChange(e)}
                            />
                </LocalizationProvider>
            )}
        />

        <Button fullWidth type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default CreateEvent;
