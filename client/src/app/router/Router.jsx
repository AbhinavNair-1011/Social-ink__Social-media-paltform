import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";

import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";

import FeedPage from "../../features/posts/pages/FeedPage";
import ProfilePage from "../../features/users/pages/ProfilePage";

import NotFoundPage from "../../pages/NotFountPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ChangeEmailPage from "../../features/auth/pages/ChangeEmailPage";
import VerifyEmailPage from "../../features/auth/pages/VerifyEmailPage";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../../features/auth/pages/ResetPasswordPage";
import VerifyTwoFactorPage from "../../features/auth/pages/VerifyTwoFactorPage";
import UserProfilePage from "../../features/users/pages/UserProfilePage";
import SearchUsersPage from "../../features/users/pages/SearchUsersPage";
import FollowingPage from "../../features/users/pages/FollowingPage";
import FollowersPage from "../../features/users/pages/FollowersPage";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/verify-email",
            element: <VerifyEmailPage />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "/reset-password",
            element: <ResetPasswordPage />,
          },
          {
            path: "/change-email",
            element: <ChangeEmailPage />,
          },
          {
            path: "/verify-2fa",
            element: <VerifyTwoFactorPage />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/feed",
            element: <FeedPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/users",
            element: <SearchUsersPage />,
          },
          {
            path: "/users/:userId/followers",
            element: <FollowersPage />,
          },
          {
            path: "/users/:userId/following",
            element: <FollowingPage />,
          },
          {
            path: "/users/:userId",
            element: <UserProfilePage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
