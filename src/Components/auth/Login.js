import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "Components/auth/LoginValidation";
import axios from "axios";

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //  console.log("Login button clicked");
    const err = Validation(values);
    console.log(" Validation errors:", err)
    setErrors(err);

    if (Object.keys(err).length === 0) {
      axios
        .post("http://172.16.2.246:8181/auth/login", values)
        .then((res) => {
          // API response ke structure ke according isse adjust karo aur si
          if (res.data.jwtToken) {
            localStorage.setItem("token", res.data.jwtToken);
            navigate("/welcomePage");
          } else {
            alert(res.data.message || "Login failed");
          }
        })
        .catch((error) => {
          console.error("Login error:", error);
          alert("Invalid credentials or server error");
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
            <Link
              to="/signup"
              className="text-indigo-600 hover:underline font-medium"
            >
              Register Here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
