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
  const [formData, setFormData] = useState({
    profilePicture: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  console.log(modalState);
  return (
    <Modal onClose={handleClose} open={modalState}>
      <Box component={"form"} sx={{ ...style, borderRadius: 1 }}>
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
        <Button onClick={() => console.log(formData)} variant="contained">
          Submit
        </Button>
      </Box>
    </Modal>
  );
}

export default ProfilePicModal;
