import axios from "axios";

import { ChangeEmailResponse, ResponseBody } from "../types";

export const changeEmail = async (
  userId: number | null | undefined,
  password: string,
  email: string | null | undefined
): Promise<ChangeEmailResponse<ResponseBody>> => {
  const response = await axios
    .put(`http://localhost:8080/users/${userId}/email`, {
      userId: userId,
      email: email,
      password: password,
    })
    .then((response) => {
      return {
        status: response.status,
        data: response.data
      };
    })
    .catch((error) => {
      return {
        status: error.response.status || 500,
        data: null
      };
    });

  return response;
};