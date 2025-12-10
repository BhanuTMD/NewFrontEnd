import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "Components/auth/LoginValidation";
import axios from "axios";
import Swal from "sweetalert2";
import { EyeIcon, EyeSlashIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = Validation(values);
    setErrors(err);

    if (Object.keys(err).length === 0) {
      setIsSubmitting(true);

      Swal.fire({
        title: "Request sent",
        text: "Please wait while we process your login...",
        icon: "info",
        showConfirmButton: false,
        timer: 8000,
      });

      axios
        .post("http://172.16.2.246:8080/auth/login", values)
        .then((res) => {
          const userName = res.data.userName;
          const userEmail = values.email;

          localStorage.setItem("userName", userName);
          localStorage.setItem("userEmail", userEmail);

          Swal.fire({
            title: "OTP Sent!",
            text: "Please check your email for the OTP.",
            icon: "success",
            confirmButtonColor: "#4F46E5",
          }).then(() => {
            navigate("/otpLoginVerify", { state: { email: values.email } });
          });
        })
        .catch((err) => {
          console.error("Login error:", err);
          Swal.fire({
            title: "Login Failed",
            text: "Invalid credentials or server error.",
            icon: "error",
            confirmButtonColor: "#EF4444",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 overflow-hidden">
      {/* Blur circles in background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-5xl mx-4 md:mx-6 lg:mx-8">
        <div className="flex flex-col md:flex-row bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden">
          
          {/* Left side - illustration / login feel */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 relative p-8 lg:p-10 items-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
            
            <div className="relative text-white space-y-5">
              <p className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.16em] bg-white/15 border border-white/25 rounded-full px-3 py-1 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2" />
                Secure Sign In
              </p>

              <h1 className="text-3xl lg:text-4xl font-bold leading-snug">
                Welcome back to
                <span className="block text-emerald-300 mt-1">
                  your dashboard
                </span>
              </h1>

              <p className="text-sm lg:text-base text-indigo-100/90">
                Access your account, manage workflows, and continue right where
                you left off. Your data is secured with multi-factor
                authentication.
              </p>

              {/* Fake stats / login feel */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs lg:text-sm">
                <div className="bg-white/15 rounded-2xl px-4 py-3 border border-white/20 backdrop-blur-md">
                  <p className="text-indigo-100/80">Successful logins today</p>
                  <p className="mt-1 text-lg font-semibold">1,248</p>
                </div>
                <div className="bg-white/15 rounded-2xl px-4 py-3 border border-white/20 backdrop-blur-md">
                  <p className="text-indigo-100/80">Last activity</p>
                  <p className="mt-1 text-lg font-semibold">2 mins ago</p>
                </div>
              </div>

              {/* Illustration box (login feel) */}
              <div className="mt-4 bg-white/10 rounded-2xl border border-white/25 p-4 backdrop-blur-md flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-400/90 flex items-center justify-center font-semibold text-slate-900">
                  🔐
                </div>
                <div className="text-xs lg:text-sm">
                  <p className="font-semibold">2-Step Verification</p>
                  <p className="text-indigo-100/80">OTP sent directly to your email</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - actual login form */}
          <div className="w-full md:w-1/2 bg-slate-900/60 px-6 py-7 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="flex flex-col gap-1 mb-6 sm:mb-8">
              <p className="text-xs font-medium tracking-[0.22em] text-indigo-300 uppercase">
                Login
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                Welcome back
                <span className="text-indigo-400 text-xl">👋</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Enter your credentials to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-200 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={handleInput}
                    className={`w-full rounded-2xl border bg-slate-900/70 text-slate-100 text-sm sm:text-base px-3.5 py-2.5 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400/80 focus:border-indigo-400/80 transition ${
                      errors.email
                        ? "border-red-500/80"
                        : "border-slate-600/70"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password with show/hide */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-indigo-300 hover:text-indigo-200 underline-offset-2 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleInput}
                    className={`w-full rounded-2xl border bg-slate-900/70 text-slate-100 text-sm sm:text-base px-3.5 py-2.5 sm:px-4 sm:py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-indigo-400/80 focus:border-indigo-400/80 transition ${
                      errors.password
                        ? "border-red-500/80"
                        : "border-slate-600/70"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-400"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/60 text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Logging you in...
                  </>
                ) : (
                  <>
                    Log In
                    <ArrowRightIcon className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-3">
                <div className="h-px flex-1 bg-slate-700/60" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400">
                  OR
                </span>
                <div className="h-px flex-1 bg-slate-700/60" />
              </div>

              {/* Signup link */}
              <p className="text-xs sm:text-sm text-center text-slate-300">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
                >
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
