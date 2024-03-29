import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from "../components/Layout";
import Login from '../features/Login/pages/Login';
import RecordItem from "../features/RecordItem/pages/RecordItem";
import RecordItemLog from "../features/RecordItemLog/pages/RecordItemLog";
import Setting from "../features/Setting/pages/Setting";
import ChangeEmail from "../features/ChangeEmail/pages/ChangeEmail";
import ChangePassword from "../features/ChangePassword/pages/ChangePassword";
import Cancel from "../features/Cancel/pages/Cancel";
import Page404 from "../features/NotPage/pages/Page404";
import SignUp from "../features/SignUp/pages/SignUp";
import PreRegistrationComplete from "../features/SignUp/pages/PreRegistrationComplete";
import About from "./About";
import Terms from "./Terms";
import PrivacyPolicy from "./PrivacyPolicy";
import AuthProvider from "../features/Auth/components/AuthProvider"
import ProtectedRoute from "../features/Auth/components/ProtectedRoute";
import LoginProtectedRoute from "../features/Auth/components/LoginProtectedRoute";
import ApiClientProvider from "../lib/api-client/ApiClientProvider";
import PublicLayout from "../components/PublicLayout";

// Timerページで時間を計測中にページ遷移を防ぐために使用している
// ReactRouterPromptを動かすために下記のようなルーディングの書き方をしている。
// 公式にこの書き方の方が良いとも書かれている気がする（？）のでこのまま
export const routesConfig = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "login",
        element:
        <ApiClientProvider>
          <AuthProvider>
            <LoginProtectedRoute>
                <Login />
            </LoginProtectedRoute>
          </AuthProvider>
        </ApiClientProvider>
      },
      { path: "signup", element: <SignUp /> },
      { path: "preregistrationcomplete", element: <PreRegistrationComplete /> },
      { path: "about", element: <About /> },
      { path: "terms", element: <Terms /> },
      { path: "privacypolicy", element: <PrivacyPolicy /> },
    ]
  },
  {
    path: "/",
    element:
      <ApiClientProvider>
        <AuthProvider>
          <ProtectedRoute>
              <Layout />
          </ProtectedRoute>
        </AuthProvider>
      </ApiClientProvider>,
    children: [
      { index: true, element: <RecordItem /> },
      { path: "recorditemlog", element: <RecordItemLog /> },
      {
        path: "setting",
        element: <Setting />,
        children: [
          { path: "changeemail", element: <ChangeEmail /> },
          { path: "changepassword", element: <ChangePassword /> },
          { path: "cancel", element: <Cancel /> },
        ],
      },
      { path: "*", element: <Page404 /> },
    ]
  }
];

const router = createBrowserRouter(routesConfig);

const Router = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default Router;
