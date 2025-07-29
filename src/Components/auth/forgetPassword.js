import React, { useState, useRef } from "react";
import axios from "axios";
const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP, 3 = reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRefs = useRef([]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://172.16.2.246:8080/auth/forgot-password", { email });
      alert("OTP sent to your email");
      setStep(2);
    } catch (err) {
      alert(err.response?.data || "Error sending OTP");
    }
  };
  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://172.16.2.246:8080/auth/forgot-password/verify-otp?email=${email}&otp=${otp}`);
      alert("OTP verified successfully");
      setStep(3);
    } catch (err) {
      alert(err.response?.data || "Invalid OTP");
    }
  };
  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");
    try {
      await axios.post("http://172.16.2.246:8080/auth/forgot-password/reset", {
        email,
        newPassword: password,
      });
      alert("Password reset successful! Please login.");
      // navigate to login if using react-router
    } catch (err) {
      alert(err.response?.data || "Error resetting password");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-indigo-700 text-center mb-4">Forgot Password</h2>
            <form onSubmit={handleSendOtp}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 mb-4"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition"
              >
                Send OTP
              </button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-indigo-700 text-center mb-4">Verify OTP</h2>
            <form onSubmit={handleVerifyOtp}>
              <div className="flex justify-between mb-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 text-center border-2 border-gray-300 rounded-xl text-xl font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all"
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d?$/.test(value)) {
                        let otpArray = otp.split("");
                        otpArray[index] = value;
                        setOtp(otpArray.join(""));
                        if (value && index < inputRefs.current.length - 1) {
                          inputRefs.current[index + 1].focus();
                        }
                      }
                    }}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold text-indigo-700 text-center mb-4">Reset Password</h2>
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 mb-4"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 mb-4"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition"
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
