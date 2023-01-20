import { useGetUser } from "../utils/use";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

function User({userId, status}) {
  const { user } = useUser();
  const { data, isLoading, isError } = useGetUser({
    token: user,
    userId,
  });

  const navigate = useNavigate()
  return (
      <ListItem>
        <ListItemButton onClick={() => navigate('/users/' + userId) }>
          <ListItemAvatar>
            <Avatar alt={data?.username} src={data?.profilePicture}>
                {data?.username.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={data?.username} secondary={status} />
        </ListItemButton>
      </ListItem>
    
  );
}

export default User;
