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
  const { user, userDetails } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const { mutate, isLoading, error } = useMutation({
    mutationKey: ["uploadProfilePic", userDetails._id],
    mutationFn: (data) =>
      api
        .query(user)
        .post(api.endpoints.uploadProfileImage, data, { withCredentials: true })
        .then((res) => res.data),
    enabled: false,
    onSuccess: (data) => {
      console.log(data);
    },
    onMutate: () => {
      console.log("mutating");
    },
    onError: (err) => {
      console.log(err.response.data.message);
    },
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
    console.log(data);
    let form = new FormData();
    console.log(form);
    form.append("image", data.image[0]);
    console.log(data.image[0].name);
    mutate(form);
  };
  if (errors?.image?.message) {
    toast.error(errors?.image?.message);
    console.log(errors);
    clearErrors("image");
  }
  const handleChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  console.log(modalState);
  return (
    <Modal onClose={handleClose} open={modalState}>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component={"form"}
        sx={{ ...style, borderRadius: 1 }}
      >
        <Button
          onClick={() => navigate("/myimages")}
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
