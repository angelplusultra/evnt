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
import axios from 'axios'
import { useMutation } from "@tanstack/react-query";

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
  
  // const {mutate, isLoading, error} = useMutation({
  //   mutationKey: ['uploadProfilePic', userDetails._id],
  //   mutationFn: (data) => axios.post('http://localhost:5000/api/users/me/profileimage', data, {headers: {
  //     'Content-Type': 'multipart/form-data',
  //     'Authorization': `Bearer ${user}`,
  //     }},{withCredentials: true})
  //     .then(res => res.data),
  //     enabled: false,
  //     onSuccess: (data) => {
  //       console.log(data)
  //     },
  //     onMutate: () => {
  //       console.log('mutating')
  //     }
  
  //   }
  const {mutate, isLoading, error} = useMutation({
    mutationKey: ['uploadProfilePic', userDetails._id],
    mutationFn: (data) => api.query(user).post(api.endpoints.uploadProfileImage, data, {withCredentials: true})
    .then(res => res.data),
      enabled: false,
      onSuccess: (data) => {
        console.log(data)
      },
      onMutate: () => {
        console.log('mutating')
      },
      onError: (err) => {
        console.log(err.response.data.message)
      }
  
    }
  )
  const handleSubmit = (e) => {
    e.preventDefault();
    let form = new FormData();
    console.log(form);
    form.append("image", selectedFile);
    console.log(form);
    mutate(form)

    // axios.post('http://localhost:5000/api/users/me/profileimage', form, {headers: {
    //   'Content-Type': 'multipart/form-data',
    //   'Authorization': `Bearer ${user}`,
    // }},{withCredentials: true})
    // .then(res => console.log(res.data))
    // .catch(err => console.log(err))
  };

  const handleChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  console.log(modalState);
  return (
    <Modal onClose={handleClose} open={modalState}>
      <Box
        onSubmit={handleSubmit}
        component={"form"}
        sx={{ ...style, borderRadius: 1 }}
      >
        <Button component="label" variant="contained">
          Upload Image
          <Input
            name="profilePicture"
            onChange={handleChange}
            type="file"
            accept="image/*"
            sx={{
              display: "none",
            }}
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
