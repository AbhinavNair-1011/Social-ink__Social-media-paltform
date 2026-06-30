import AuthCard from "../components/AuthCard";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  return (
    <AuthCard title="Create your account">
      <RegisterForm />
    </AuthCard>
  );
}

export default RegisterPage;