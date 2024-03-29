import {
  Input,
  Modal,
  Typography,
  Box,
  Button,
  IconButton,
  Upl,
} from "@mui/material";
import { useRef } from "react";
import { useState } from "react";
import { api } from "../api/api";
import { useUser } from "../context/userContext";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ErrorMessage } from "@hookform/error-message";
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

function ProfilePicModal({ modalState, handleClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const { user, userDetails, refetch } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const { mutate, status, error } = useMutation({
    mutationKey: ["uploadProfilePic", userDetails._id],
    mutationFn: (data) =>
      api
        .query(user)
        .post(api.endpoints.uploadProfileImage, data, { withCredentials: true })
        .then((res) => res.data),
    enabled: false,
  });

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
  const onSubmit = (data) => {
	handleClose()
	const toastId = toast.loading("Uploading image");
    console.log(data);
    let form = new FormData();
    console.log(form);
    form.append("image", data.image[0]);
    form.append("setProfile", data.setProfile);

    console.log(data.setProfile);
    mutate(form, {
      onSuccess: () => {
        refetch();
        toast.update(toastId, {
          render: "Image uploaded 👍",
          type: "success",
          isLoading: false,
          autoClose: 4000,
        });
      },
    });
  };
  if (errors?.image?.message) {
    toast.error(errors?.image?.message);
    console.log(errors);
    clearErrors("image");
  }
  console.log(modalState);
  return (
    <Modal onClose={handleClose} open={modalState}>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component={"form"}
        sx={{ ...style, borderRadius: 1 }}
      >
        <FormGroup>
          <FormControlLabel
            control={<Checkbox {...register("setProfile")} />}
            label="Change to current profile?"
          />
        </FormGroup>
        <Button
          onClick={() => navigate("gallery")}
          variant="contained"
          color="secondary"
        >
          My Images
        </Button>
        <Button component="label" variant="contained">
          Upload Image
          <Input
            sx={{
              display: "none",
            }}
            accept="image/*"
            {...register("image", {
              required: "Please select an image to upload",
              validate: isValidFile,
            })}
            type="file"
          />
        </Button>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </Modal>
  );
}

export default ProfilePicModal;
