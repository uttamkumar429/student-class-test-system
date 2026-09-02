import { useState } from "react";
import {
  BookOpen,
  ChartColumn,
  ClipboardCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";


import { useDispatch } from "react-redux";
import { loginThunk } from "../../redux/auth/authThunk";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [loading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
    };
const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("STEP 1 : Form Submitted");

  setLoading(true);

  try {

    console.log("STEP 2 : Dispatch Starting");

    await dispatch(loginThunk(formData, navigate));

    console.log("STEP 3 : Dispatch Completed");

  } catch (error) {

    console.log("STEP 4 : Error", error);

  } finally {

    setLoading(false);

  }
};
    
    return (
    <AuthLayout>
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

        {/* Left Section */}

        <div className="hidden flex-col justify-center bg-blue-600 p-12 text-white lg:flex">

          <h1 className="mb-4 text-4xl font-bold">
            TestVeda
          </h1>

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
        >
            <h2 className="mb-2 text-3xl font-bold text-slate-800">
              Welcome Back 👋
            </h2>

            <p className="mb-8 text-slate-500">
              Login to continue
            </p>

            <Input
                label="Email or Phone"
                name="emailOrPhone"
                placeholder="Enter email or phone"
                value={formData.emailOrPhone}
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
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-600"
                />

                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

            </div>
            </div>
            <div className="mb-6 flex items-center justify-between">

            <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" />
                Remember Me
            </label>

            <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:underline"
            >
                Forgot Password?
            </button>

            </div>
            <Button
              type="submit"
              loading={loading}
            >
              Login
            </Button>
            <div className="mt-6 text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-blue-600 hover:underline"
              >
                Create an account
              </button>
            </div>

          </form>

       </div>

      </div>
    </AuthLayout>
  );
}

export default LoginPage;