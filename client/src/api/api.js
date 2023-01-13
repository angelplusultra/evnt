import axios from "axios";

export const domain = "http://localhost:5000";

const endpoints = {
  signUp: "/auth/signup",
  logIn: "/auth/login",
  getAllEvents: "/api/events",
  getSingleUser: "/api/users/",
  getSingleEvent: "/api/events/",
};

export const api = {
  query: (token) =>
    axios.create({
      baseURL: domain,
      headers: {
        Authorization: "Bearer " + token,
      },
    }),

  endpoints,
};

export default endpoints;
