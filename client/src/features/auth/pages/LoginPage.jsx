import AuthCard from "../components/AuthCard";
import LoginForm from "../components/LoginForm";
import { useQueryClient } from "@tanstack/react-query";

function LoginPage() {
  const queryClient = useQueryClient();
  return (
    <AuthCard title="Welcome Back">
      <LoginForm />
    </AuthCard>
  );
}

export default LoginPage;