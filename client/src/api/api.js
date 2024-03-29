import axios from "axios";

export const domain = process.env.SERVER_URL || "http://localhost:5000";

const endpoints = {
  signUp: "/auth/signup",
  logIn: "/auth/login",
  getAllEvents: "/api/events",
  getSingleUser: "/api/users/",
  getSingleEvent: "/api/events/",
  getActivity: '/api/users/activity',
  createEvent: "/api/events",
  markAttendance: "/api/events/",
  getMe: '/api/users/me',
  deleteAttendance: '/api/events/',
  uploadProfileImage: '/api/users/me/profileimage',
  updateProfileImage: '/api/users/me/profileimage/',
  updateProfileImage: '/api/users/me/profileimage/'
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
