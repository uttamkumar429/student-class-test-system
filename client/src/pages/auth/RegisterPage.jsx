import { useState } from "react";
import {
  BookOpen,
  ChartColumn,
  ClipboardCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import authService from "../../services/authService";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      if (!response?.success) {
        setError(response?.message || "Registration failed.");
        return;
      }

      navigate("/verify-otp", {
        state: {
          phone: formData.phone.trim(),
          purpose: "register",
        },
      });
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Unable to complete registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        {/* Left Section */}
        <div className="hidden flex-col justify-center bg-blue-600 p-12 text-white lg:flex">
          <h1 className="mb-4 text-4xl font-bold">TestVeda</h1>

          <p className="mb-10 text-blue-100">
            Smart online examination platform for students and administrators.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <BookOpen size={28} />
              <span>Online Test Management</span>
            </div>

            <div className="flex items-center gap-4">
              <ClipboardCheck size={28} />
              <span>Instant Result Generation</span>
            </div>

            <div className="flex items-center gap-4">
              <ChartColumn size={28} />
              <span>Performance Analytics</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center p-10">
          <form
            className="w-full max-w-md"
            onSubmit={handleSubmit}
            noValidate
          >
            <h2 className="mb-2 text-3xl font-bold text-slate-800">
              Create Account
            </h2>

            <p className="mb-8 text-slate-500">
              Register to start using TestVeda
            </p>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Mobile Number"
              name="phone"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={formData.phone}
              onChange={handleChange}
            />

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-600"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading}>
              Create Account
            </Button>

            <p className="mt-5 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-medium text-blue-600 hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;