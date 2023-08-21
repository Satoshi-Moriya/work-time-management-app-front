import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";

import { loginValidationSchema } from "../../../lib/zod/validationSchema";
import { AuthContext } from "../../Auth/components/AuthProvider";
import { UserData } from "../types";

axios.defaults.withCredentials = true;

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [failAlert, setFailAlert] = useState<boolean>(false);
  const navigate = useNavigate();
  const [ , ,setUserId, setUserEmail] = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(loginValidationSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const csrfToken = await axios.post("http://localhost:8080/csrf");
      const headers = {
        "Content-Type": "application/json;charset=utf-8",
        "X-CSRF-TOKEN": csrfToken.data.token
      };
      console.log(csrfToken);
      const response = await axios.post<UserData>("http://localhost:8080/login", {
        userEmail: data.email,
        userPassword: data.password
      }, {
        headers: headers
      })
      setUserId(response.data.userId as number | null);
      setUserEmail(response.data.userEmail as string | null);
      navigate("/");
    } catch(error) {
      let message = "";
      if (axios.isAxiosError(error)) {
        message = error.message || "メールアドレスかパスワードが間違っており、ログインに失敗しました。";
      } else {
        message = "予期せぬエラーが起こり、ログインに失敗しました。時間をおいて再度お試しください。"
      }
      setErrorMessage(message);
      setFailAlert(true);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen flex-col'>
      {failAlert && (
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex'
          role='alert'
        >
          <span className='block sm:inline'>{errorMessage}</span>
          <span>
            <svg
              className='fill-current h-6 w-6 text-red-500'
              role='button'
              onClick={() => setFailAlert(false)}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <title>Close</title>
              <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
            </svg>
          </span>
        </div>
      )}
      <div className='p-10'>
        <h1 className='text-7xl'>ログイン</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-8'>
          <div className='mt-4'>
            <input
              type='email'
              id='email'
              placeholder='メールアドレス'
              {...register("email")}
              className='mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full rounded-md sm:text-sm'
            />
            <p className='text-red-500'>
              {errors.email && errors.email.message}
            </p>
          </div>
          <div className='mt-8'>
            <input
              type='password'
              id='password'
              placeholder='パスワード'
              {...register("password")}
              className='mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 block w-full rounded-md sm:text-sm'
            />
            <p className='text-red-500'>
              {errors.password && errors.password.message}
            </p>
          </div>
          <div className='mt-8'>
            <button
              type='submit'
              disabled={!isValid}
              className='bg-orange-400 border-orange-400 rounded-lg text-white font-bold px-3 py-2 w-full disabled:opacity-50 disabled:cursor-not-allowed'
            >
              ログイン
            </button>
          </div>
        </form>
        <div className='flex flex-col mt-5'>
          <Link
            to='../signup'
            relative='path'
            className='underline text-blue-500 hover:opacity-70 mt-4'
          >
            アカウントをお持ちでない場合
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
