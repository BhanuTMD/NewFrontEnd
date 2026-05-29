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
  const [otp, setOtp]               = useState(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg]     = useState("");
  const inputRefs                   = useRef([]);
  const location                    = useLocation();
  const navigate                    = useNavigate();
  const { email }                   = location.state || {};
  const { login }                   = useAuth();   // login now accepts (token, userName, roleString)

  // Auto-focus first box
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  // Redirect back to login if no email in state
  useEffect(() => {
    if (!email) navigate("/login", { replace: true });
  }, [email, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setErrorMsg("");
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6 || otp.includes("")) {
      setErrorMsg("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const res = await axios.post(
        "http://172.16.2.246:8282/api/auth/verify-otp",
        { email, otp: otpString }
      );

      // Backend returns: { token, email, role }
      // role comes as a string like "[ROLE_ADMIN, ROLE_SCIENTIST]"
      const { token, email: userEmail, role } = res.data;

      if (!token) {
        setErrorMsg("Verification failed. No token received.");
        Swal.fire("Error", "No token received from server.", "error");
        return;
      }

      // ── KEY FIX: pass all 3 args so AuthContext saves roles properly ──
      login(token, userEmail, role);

      await Swal.fire({
        title: "Verified!",
        text: "OTP verified successfully. Redirecting...",
        icon: "success",
        background: "linear-gradient(135deg, #0b1c47 0%, #1e3a8a 40%, #ff8c00 100%)",
        color: "#fff",
        iconColor: "#ffae42",
        showConfirmButton: false,
        timer: 1800,
        customClass: { popup: "rounded-xl shadow-lg backdrop-blur-md" },
      });

      navigate("/welcomePage", { replace: true });

    } catch (err) {
      console.error("OTP verify error:", err);
      const status  = err.response?.status;
      const message = err.response?.data?.error || "Something went wrong.";

      if (status === 401) {
        setErrorMsg("Invalid or expired OTP. Please try again.");
        Swal.fire("Error", "Invalid or expired OTP.", "error");
      } else if (status === 400) {
        setErrorMsg(message);
        Swal.fire("Error", message, "error");
      } else if (status === 404) {
        setErrorMsg("User not found. Please register first.");
        Swal.fire("Error", "User not found.", "error");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
        Swal.fire("Error", message, "error");
      }

      // Clear boxes on error
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setOtp(Array(6).fill(""));
    setErrorMsg("");
    inputRefs.current[0]?.focus();
    Swal.fire(
      "Cannot Resend",
      "Please go back to login and enter your password again to get a new OTP.",
      "info"
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 px-4 overflow-hidden">
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white">OTP Verification</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-indigo-200">{email || "your email"}</span>
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
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center border bg-slate-900/70 border-slate-600/70 rounded-2xl text-lg sm:text-xl font-semibold text-slate-50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/60 transition-all"
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-xs sm:text-sm text-red-400 text-center -mt-2">{errorMsg}</p>
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
              <p className="text-xs sm:text-sm text-slate-300 mb-1">Didn&apos;t receive the code?</p>
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

        <p className="mt-4 text-[11px] sm:text-xs text-center text-slate-400">
          For your security, this OTP will expire in 5 minutes. Do not share it with anyone.
        </p>
      </div>
    </div>
  );
};

export default OTPLoginVerify;

