// OtpLoginVerify.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "Components/auth/AuthContext";
import {
  ShieldCheckIcon,
  ArrowRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const OTPLoginVerify = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const { login, verifyOtp } = useAuth();

  // Auto-focus first box
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d?$/.test(value)) {
      let otpArray = otp.split("");
      otpArray[index] = value;
      const newOtp = otpArray.join("");
      setOtp(newOtp);
      setErrorMsg("");

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
      setErrorMsg("Please enter the complete 6-digit OTP.");
      Swal.fire("Invalid OTP", "Please enter 6 digit OTP.", "warning");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const res = await axios.post(
        `http://172.16.2.246:8080/auth/login/verify-otp?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(otp)}`
      );

      const { jwtToken, userName } = res.data;

      login(jwtToken, userName);
      verifyOtp();

      Swal.fire({
        title: "Verified!",
        text: "OTP verified successfully. Redirecting...",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/viewTechnology", { replace: true });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setErrorMsg("Invalid or expired OTP. Please try again.");
        Swal.fire("Error", "Invalid or expired OTP.", "error");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
        Swal.fire("Error", "Something went wrong.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    // Yaha baad me API call laga sakte ho:
    // await axios.post("/auth/login/resend-otp", { email })
    Swal.fire(
      "Resend OTP",
      "Resend OTP functionality will be integrated with backend.",
      "info"
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 px-4 overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-6 sm:mb-7">
            <div className="h-12 w-12 rounded-2xl bg-emerald-400/90 flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <ShieldCheckIcon className="h-7 w-7 text-slate-900" />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                OTP Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-indigo-200">
                  {email || "your email"}
                </span>
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
            {/* OTP Boxes */}
            <div className="flex justify-between gap-2 sm:gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center border bg-slate-900/70 border-slate-600/70 rounded-2xl text-lg sm:text-xl font-semibold text-slate-50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/60 transition-all tracking-[0.2em]"
                  value={otp[index] || ""}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-xs sm:text-sm text-red-400 text-center -mt-2">
                {errorMsg}
              </p>
            )}

            {/* Verify button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/60 text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 shadow-lg shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Resend */}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-slate-300 mb-1">
                Didn&apos;t receive the code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-indigo-300 hover:text-indigo-200 hover:underline underline-offset-2"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Resend OTP
              </button>
            </div>
          </form>
        </div>

        {/* Helper text bottom */}
        <p className="mt-4 text-[11px] sm:text-xs text-center text-slate-400">
          For your security, this OTP will expire shortly. Do not share it with
          anyone.
        </p>
      </div>
    </div>
  );
};

export default OTPLoginVerify;
