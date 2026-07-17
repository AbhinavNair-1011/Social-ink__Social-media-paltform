import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import LazyPage from "../../shared/components/LazyPage";
import ChatPage from "../../features/chat/pages/ChatPage";


const LoginPage = lazy(() => import("../../features/auth/pages/LoginPage"));

const RegisterPage = lazy(
  () => import("../../features/auth/pages/RegisterPage"),
);

const FeedPage = lazy(() => import("../../features/posts/pages/FeedPage"));

const ProfilePage = lazy(
  () => import("../../features/users/pages/ProfilePage"),
);

const SearchUsersPage = lazy(
  () => import("../../features/users/pages/SearchUsersPage"),
);

const UserProfilePage = lazy(
  () => import("../../features/users/pages/UserProfilePage"),
);

const VerifyEmailPage = lazy(
  () => import("../../features/auth/pages/VerifyEmailPage"),
);

const ForgotPasswordPage = lazy(
  () => import("../../features/auth/pages/ForgotPasswordPage"),
);

const ResetPasswordPage = lazy(
  () => import("../../features/auth/pages/ResetPasswordPage"),
);

const ChangeEmailPage = lazy(
  () => import("../../features/auth/pages/ChangeEmailPage"),
);

const VerifyTwoFactorPage = lazy(
  () => import("../../features/auth/pages/VerifyTwoFactorPage"),
);

const NotificationPage = lazy(
  () => import("../../features/notification/pages/NotificationPage"),
);
const PostPage = lazy( ()=> import("../../features/posts/pages/PostPage"))
const NotFoundPage = lazy(() => import("../../pages/NotFountPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: (
          <LazyPage>
            <AuthLayout />
          </LazyPage>
        ),
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
        element: (
          <LazyPage>
            <AppLayout />
          </LazyPage>
        ),
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
            path: "/users/:userId",
            element: <UserProfilePage />,
          },
          {
            path: "/notifications",
            element: <NotificationPage />,
          },
          {
            path: "/posts/:postId",
            element: <PostPage />,
          },
          {
            path:"/chat",
            element:<ChatPage/>
          }
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
