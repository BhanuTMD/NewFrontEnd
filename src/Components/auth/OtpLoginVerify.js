import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OTPLoginVerify = () => {
  const [otp, setOtp] = useState("");
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { email } = location.state || {};

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      let otpArray = otp.split("");
      otpArray[index] = value;
      setOtp(otpArray.join(""));

      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter 6 digit OTP");
      return;
    }

    try {
      const res = await axios.post(
        `http://172.16.2.246:8080/auth/login/verify-otp?email=${email}&otp=${otp}`
      );
      const { jwtToken, userName } = res.data;
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("userName", userName);
      navigate("/welcomePage");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert("Invalid or expired OTP");
      } else {
        console.error(err);
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-3">
          OTP Verification
        </h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          Enter the 6-digit OTP sent to <span className="font-medium">{email}</span>
        </p>

        {/* OTP Input Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-14 text-center border-2 border-gray-300 rounded-xl text-xl font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all"
                value={otp[index] || ""}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-md transition duration-200"
          >
            Verify OTP
          </button>

          {/* Resend OTP */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => alert("Resend OTP")}
              className="text-indigo-600 font-medium hover:underline hover:text-indigo-700"
            >
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPLoginVerify;
