import { useUser } from "../../../context/userContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/api";
import { NavLink } from "react-router-dom";
function ActvityPage() {
  const { userDetails, user: token, refetch, isRefetching } = useUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["getActivity"],
    queryFn: () => api.query(token).get(api.endpoints.getActivity),
  });
  console.log(data?.data);
  return (
    <ul>
      {data?.data.map((activity) => {
        const { activityDetails, activityType } = activity;
        const arr = activityDetails.split(" ");
        console.log(activityDetails);
        const username = arr[0];
        arr.shift();
        console.log(arr);
        if (activityType === "Event Creation") {
          const { title, id } = activity.event;
          return (
            <li>
              <NavLink to={`/users/${activity.user.id}`}>{username}</NavLink>{" "}
              created an event called <NavLink to={`/events/${id}`}>{title}</NavLink>
            </li>
          );
        }
        if(activityType === 'Follow'){
          const { followed } = activity
          return (
            <li>
              <NavLink to={`/users/${activity.userId}`}>{username}</NavLink> followed {(followed.id === userDetails.id ? <NavLink to={`/users/${followed.id}`}>{followed. username}</NavLink> : "you")}
          </li>
          )

        }
        return (
          <li>
            <NavLink to={`/users/${activity.userId}`}>{username}</NavLink>{" "}
            {arr.join(" ")}
          </li>
        );
      })}
    </ul>
  );
}

export default ActvityPage;
