import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "Components/auth/SignupValidation";
import axios from "axios";
import Swal from "sweetalert2";
import { EyeIcon, EyeSlashIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { labOptions } from "Components/data/lab";

function Signup() {
  const [values, setValues] = useState({
    name: "",
    designation: "",
    lab: "",
    email: "",
    phoneNumber: "",
    password: "",
    employeeId: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsSubmitting(true);

        const response = await axios.post(
          "http://172.16.2.246:8080/auth/register",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          Swal.fire({
            title: "Success!",
            text: "Registration successful!",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#4F46E5",
          }).then(() => {
            navigate("/login");
          });
        } else {
          Swal.fire(
            "Error",
            response.data?.message ||
              "Registration failed. Please check your details.",
            "error"
          );
        }
      } catch (error) {
        console.error("Signup error:", error.response?.data || error.message);
        Swal.fire(
          "Error",
          error.response?.data?.message ||
            "Something went wrong during registration.",
          "error"
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("Validation Errors:", validationErrors);
      Swal.fire(
        "Validation Error",
        "Please fix the errors in the form.",
        "warning"
      );
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 overflow-hidden py-10">
      {/* Blur circles in background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-4 md:mx-6 lg:mx-8">
        <div className="flex flex-col md:flex-row bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden">
          {/* Left side - illustration / info */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 relative p-8 lg:p-10 items-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />

            <div className="relative text-white space-y-5">
              <p className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.16em] bg-white/15 border border-white/25 rounded-full px-3 py-1 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2" />
                New User Registration
              </p>

              <h1 className="text-3xl lg:text-4xl font-bold leading-snug">
                Create your
                <span className="block text-emerald-300 mt-1">
                  CSIR-Workflow account
                </span>
              </h1>

              <p className="text-sm lg:text-base text-indigo-100/90">
                Sign up with your official CSIR details, select your lab and
                designation to get personalized access to the platform.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs lg:text-sm">
                <div className="bg-white/15 rounded-2xl px-4 py-3 border border-white/20 backdrop-blur-md">
                  <p className="text-indigo-100/80">Labs onboarded</p>
                  <p className="mt-1 text-lg font-semibold">45+</p>
                </div>
                <div className="bg-white/15 rounded-2xl px-4 py-3 border border-white/20 backdrop-blur-md">
                  <p className="text-indigo-100/80">Active scientists</p>
                  <p className="mt-1 text-lg font-semibold">1.2k+</p>
                </div>
              </div>

              <div className="mt-4 bg-white/10 rounded-2xl border border-white/25 p-4 backdrop-blur-md flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-400/90 flex items-center justify-center text-slate-900">
                  <UserPlusIcon className="h-6 w-6" />
                </div>
                <div className="text-xs lg:text-sm">
                  <p className="font-semibold">Instant access</p>
                  <p className="text-indigo-100/80">
                    Verify your email and start using the portal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Signup form */}
          <div className="w-full md:w-1/2 bg-slate-900/60 px-6 py-7 sm:px-8 sm:py-10 lg:px-10 lg:py-12 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col gap-1 mb-6 sm:mb-8">
              <p className="text-xs font-medium tracking-[0.22em] text-indigo-300 uppercase">
                Sign up
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Create your account
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Fill in your official CSIR details to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <Input
                label="Name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleInput}
                error={errors.name}
              />

              <Input
                label="Employee ID"
                name="employeeId"
                type="text"
                value={values.employeeId}
                onChange={handleInput}
                error={errors.employeeId}
              />

              {/* Designation */}
              <div>
                <label
                  htmlFor="designation"
                  className="block text-sm font-medium text-slate-200 mb-1.5"
                >
                  Designation
                </label>
                <select
                  id="designation"
                  name="designation"
                  value={values.designation}
                  onChange={handleInput}
                  className={`w-full rounded-2xl border bg-slate-900/70 text-slate-100 text-sm sm:text-base px-3.5 py-2.5 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400/80 focus:border-indigo-400/80 transition ${
                    errors.designation
                      ? "border-red-500/80"
                      : "border-slate-600/70"
                  }`}
                >
                  <option value="">Select Designation</option>
                  <option value="Director/Head">Director/Head</option>
                  <option value="Chief Scientist">Chief Scientist</option>
                  <option value="Senior Principal Scientist">
                    Senior Principal Scientist
                  </option>
                  <option value="Principal Scientist">
                    Principal Scientist
                  </option>
                  <option value="Senior Scientist">Senior Scientist</option>
                  <option value="Scientist">Scientist</option>
                  <option value="Technical Officer">Technical Officer</option>
                  <option value="Technical Assistant">
                    Technical Assistant
                  </option>
                </select>
                {errors.designation && <Error text={errors.designation} />}
              </div>

              {/* Lab */}
              <div>
                <label
                  htmlFor="lab"
                  className="block text-sm font-medium text-slate-200 mb-1.5"
                >
                  CSIR Lab / Institute
                </label>
                <select
                  id="lab"
                  name="lab"
                  value={values.lab}
                  onChange={handleInput}
                  className={`w-full rounded-2xl border bg-slate-900/70 text-slate-100 text-sm sm:text-base px-3.5 py-2.5 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400/80 focus:border-indigo-400/80 transition ${
                    errors.lab ? "border-red-500/80" : "border-slate-600/70"
                  }`}
                >
                  <option value="">Select Lab / Institute</option>
                  {labOptions.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
                {errors.lab && <Error text={errors.lab} />}
              </div>

              <Input
                label="Mobile Number"
                name="phoneNumber"
                type="tel"
                value={values.phoneNumber}
                onChange={handleInput}
                error={errors.phoneNumber}
              />

              <Input
                label="CSIR Email ID"
                name="email"
                type="email"
                value={values.email}
                onChange={handleInput}
                error={errors.email}
              />

              {/* Password with show/hide */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleInput}
                    placeholder="Enter your password"
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
                {errors.password && <Error text={errors.password} />}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/60 text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 shadow-lg shadow-emerald-500/30 transition-transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <UserPlusIcon className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Login link */}
              <p className="text-xs sm:text-sm text-center text-slate-300 mt-3">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Input for dark theme
const Input = ({ label, name, type, value, onChange, error }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-200 mb-1.5"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={`Enter your ${label.toLowerCase()}`}
      className={`w-full rounded-2xl border bg-slate-900/70 text-slate-100 text-sm sm:text-base px-3.5 py-2.5 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400/80 focus:border-indigo-400/80 transition ${
        error ? "border-red-500/80" : "border-slate-600/70"
      }`}
    />
    {error && <Error text={error} />}
  </div>
);

const Error = ({ text }) => (
  <p className="text-red-400 text-xs mt-1">{text}</p>
);

export default Signup;
