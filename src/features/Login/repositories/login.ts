import axios from "axios";

import { UserData } from "../types";

export const login = async(
  email: string | null | undefined,
  password: string
) => {
  // responseのinterceptorsがつけたくないから、直接csrfTokenつけている
  const csrfToken = await axios.post("http://localhost:8080/csrf", null, {
    withCredentials: true
  });
  const headers = {
    "Content-Type": "application/json;charset=utf-8",
    "X-CSRF-TOKEN": csrfToken.data.token
  };
  return await axios.post<UserData>("http://localhost:8080/login", {
    userEmail: email,
    userPassword: password
  }, {
    withCredentials: true,
    headers: headers
  });
};