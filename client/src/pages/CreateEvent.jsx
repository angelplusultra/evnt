import { useForm } from "react-hook-form";
import {
  Container,
  TextField,
  Box,
  Button,
  FormLabel,
  IconButton,
  Typography,
  List,
  ListItemText,
  ListItem,
  Divider,
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../api/api";
import { useUser } from "../context/userContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Controller } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import ImageIcon from "@mui/icons-material/Image";
import { height } from "@mui/system";
function CreateEvent() {
  let toastId;
  const navigate = useNavigate();
  // @1 Get user from context
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [previewImage, setPreviewImage] = useState();
  const [lineup, setLineup] = useState([]);
  const [inputError, setError] = useState(null);

  const inputSize = "large";

  const isValidFile = (image) => {
    if (image) {
      if (image[0].size > 1024 * 1024) {
        toast.error("File size too large");
        return false;
      }
      switch (image[0].type) {
        case "image/jpeg":
          return true;
        case "image/png":
          return true;
        case "image/jpg":
          return true;
        default:
          toast.error("File format not supported");
          return false;
      }
    }
  };

  function handleInputChange(e) {
    if (inputError) setError(null);
    setInput(e.target.value);
  }
  function addArtistToList() {
    if (!input) return setError("Please enter an artist");
    setLineup([...lineup, input]);
    setInput("");
  }

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
    onSuccess: (data) => {
      console.log(data);
      toast.update(toastId, {
        render: "Event created successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      navigate(`/events/${data.data._id}`);
    },
    onMutate: () => {
      toastId = toast.loading("Creating event...");
    },
  });
  function onSubmit(data) {
    if (lineup.length === 0)
      return setError("Please add at least one artist to the lineup");

    let form = new FormData();
    for (const key in data) {
      if (key === "location") {
        form.append("location", JSON.stringify(data.location));
      } else if (key === "poster") {
        form.append("poster", data[key][0]);
      } else {
        form.append(key, data[key]);
      }
    }
    lineup.forEach((artist) => form.append("lineup", artist));
    // const formattedData = {
    //   date: data.date._d,
    //   lineup: lineup,
    //   ...form,
    // };
    //
    // return console.log(form)
    mutate(form);
  }
  if (error) {
    return error.response?.data?.errors?.forEach((error) =>
      console.log(error.message)
    );
  }
  // Ideas to handle list conundrum
  //  create state for an array
  // when thew user clicks the plus button, add the value to the array
  // Display the array in the form
  // When the user submits the form, send the array along with the rest of the data
  //

  let inputSX = {
    width: 500,
  };
  return (
    <Container>
      <Box>
        <Typography
          sx={{
            mt: 5,
            ml: { lg: 15, sm: 0 },
            textAlign: {sm: 'center', lg: 'start'}
          }}
          variant="h3"
        >
          Create Event
        </Typography>
      </Box>
      <Box
        sx={{
          p: 5,
          mb: 10,
          display: "flex",
          flexDirection: {
            md: 'row',
            xs: 'column'
          },
          justifyContent: "space-evenly",
          alignItems: {sm: 'center', md: 'flex-start'}
        }}
      >
        <Box
          onSubmit={handleSubmit(onSubmit)}
          component="form"
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            borderRadius: 5,
            p: 5,
            boxShadow: 3,
          }}
        >
          <TextField
            size={inputSize}
            margin="none"
            id="title"
            label="Title"
            name="title"
            autoComplete="title"
            sx={inputSX}
            autoFocus
            error={errors.title ? true : false}
            helperText={errors.title?.message}
            {...register("title", { required: "Title is required" })}
          />
          <TextField
            sx={inputSX}
            size={inputSize}
            margin="normal"
            id="genre"
            label="Genre"
            name="genre"
            autoComplete="genre"
            error={errors.genre ? true : false}
            helperText={errors.genre?.message}
            {...register("genre", { required: "Genre is required" })}
          />
          <FormLabel error={errors.poster ? true : false}>
            {errors.poster ? errors.poster.message : "Upload Poster"}
          </FormLabel>
          <IconButton
            onChange={(e) => setPreviewImage(e.target.files[0])}
            color="primary"
            component="label"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              {...register("poster", {
                required: "Please upload a poster for your event",
                validate: isValidFile,
              })}
            />
            <ImageIcon />
          </IconButton>
          {previewImage && (
            <Box>
              <img
                width={200}
                height={200}
                src={URL.createObjectURL(previewImage)}
              />
            </Box>
          )}
          <FormLabel>Lineup</FormLabel>

          {/*Make it so when the user clicks the button it adds a new value to the lineup list  */}

          <TextField
            sx={inputSX}
            margin="normal"
            size="small"
            id="lineup"
            label="Lineup"
            name="lineup"
            autoComplete="lineup"
            value={input}
            onChange={handleInputChange}
            error={inputError ? true : false}
            helperText={inputError}
          />
          <IconButton onClick={addArtistToList} aria-label="add">
            <AddIcon />
          </IconButton>
          <TextField
            sx={inputSX}
            size="small"
            margin="normal"
            rows={8}
            maxRows={Infinity}
            id="description"
            label="Description"
            name="description"
            autoComplete="description"
            multiline
            error={errors.description ? true : false}
            helperText={errors.description?.message}
            {...register("description", {
              required: "Description is required",
            })}
          />

          <FormLabel>Location</FormLabel>
          <TextField
            sx={inputSX}
            size="small"
            margin="normal"
            id="title"
            label="Address"
            name="address"
            autoComplete="address"
            error={errors.location?.address ? true : false}
            helperText={errors.location?.address?.message}
            {...register("location.address", {
              required: "Address is required",
            })}
          />
          <TextField
            sx={inputSX}
            size="small"
            margin="normal"
            id="city"
            label="City"
            name="city"
            autoComplete="city"
            error={errors.location?.city ? true : false}
            helperText={errors.location?.city?.message}
            {...register("location.city", { required: "City is required" })}
          />
          <TextField
            sx={inputSX}
            size="small"
            margin="normal"
            id="zipCode"
            label="Zip Code"
            name="zipCode"
            autoComplete="zipCode"
            error={errors.location?.zipCode ? true : false}
            helperText={errors.location?.zipCode?.message}
            {...register("location.zipCode", {
              required: "Zip Code is required",
              validate: (value) => {
                const isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value);
                return isValidZip || "Please enter a valid zip code";
              },
            })}
          />
          <TextField
            sx={inputSX}
            size="small"
            margin="normal"
            id="state"
            label="State"
            name="state"
            autoComplete="state"
            error={errors.location?.state ? true : false}
            helperText={errors.location?.state?.message}
            {...register("location.state", { required: "State is required" })}
          />
          <Controller
            name="date"
            control={control}
            defaultValue={new Date()}
            rules={{
              required: "Please select a date and time for your event",
              validate: (value) =>
                value > new Date() ||
                "Please select a date and time in the future",
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                  label="Date"
                  inputFormat="MM/DD/YYYY hh:mm A"
                  renderInput={(params) => (
                    <TextField
                      margin="normal"
                      sx={inputSX}
                      {...params}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                  value={value}
                  onChange={(e) => onChange(e)}
                />
              </LocalizationProvider>
            )}
          />

          <Button sx={{
            mt:1
          }} fullWidth size="large" type="submit" variant="contained">
            Submit
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              mb: 1,
                textAlign: 'center'
            }}
            variant="h5"
          >
            Lineup
          </Typography>
          <List
            sx={{
              p: 4,
              borderRadius: 3,
              width: {sm: 600, md: 300},
              height: 'fit-content',
              minHeight: 300,
              boxShadow: 3,
            }}
          >
            {lineup.map((artist, index) => (
              <>
                <ListItem key={index}>
                  <ListItemText sx={{}} primary={`${index + 1}. ${artist}`} />
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </Box>
      </Box>
    </Container>
  );
}

export default CreateEvent;
