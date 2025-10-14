import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "Components/auth/LoginValidation";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = Validation(values);
    setErrors(err);

    if (Object.keys(err).length === 0) {
      // ✅ Show SweetAlert popup when request is sent
      Swal.fire({
        title: "Your request has been sent",
        text: "Please wait while we process your login...",
        icon: "info",
        showConfirmButton: false,
        timer: 10000,
      });

      axios
        .post("http://172.16.2.246:8080/auth/login", values)
        .then((res) => {
          const userName = res.data.userName;
          const userEmail = values.email;

          localStorage.setItem("userName", userName);
          localStorage.setItem("userEmail", userEmail);

          // ✅ Success popup
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
        });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-200 via-white to-indigo-100">
      <div className="bg-white p-6 sm:p-10 w-full max-w-md rounded-xl shadow-xl border">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleInput}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleInput}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition duration-200"
          >
            Log In
          </button>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?
          </p>
          <div className="mt-2 text-center">
            <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
              Register Here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;