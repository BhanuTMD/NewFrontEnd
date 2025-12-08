// import React, { useState, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// const OTPVerify = () => {
//   const [otp, setOtp] = useState("");
//   const inputRefs = useRef([]); // Array of refs for each input field
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { values } = location.state || {}; // Retrieve values from state

//   const handleChange = (e, index) => {
//     const value = e.target.value;
//     if (/^\d?$/.test(value)) { // Allow only single digit numbers
//       let otpArray = otp.split("");
//       otpArray[index] = value;
//       setOtp(otpArray.join(""));

//       // Move to the next input if a value is entered
//       if (value && index < inputRefs.current.length - 1) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (
//       values &&
//       values.name &&
//       values.csirLab &&
//       values.csirEmailId &&
//       values.password &&
//       otp.length === 6
//     ) {
//       try {
//         const payload = { ...values, otp }; // Combine values with OTP
//         const response = await axios.post(
//           "http://localhost:8081/signup",
//           payload
//         );
//         console.log("API ", response);
//         if (response?.data?.message) {
//           navigate("/Login");
//         }
//       } catch (error) {
//         console.log("Error ", error);
//       }
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
//           Verify OTP
//         </h2>
//         <p className="text-sm text-gray-600 text-center mb-6">
//           Enter the 6-digit OTP sent to your mobile number.
//         </p>
//         <form onSubmit={handleSubmit}>
//           <div className="flex justify-between mb-6">
//             {Array.from({ length: 6 }).map((_, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 maxLength="1"
//                 className="w-12 h-12 text-center border rounded-lg shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={otp[index] || ""}
//                 onChange={(e) => handleChange(e, index)}
//                 onKeyDown={(e) => handleKeyDown(e, index)}
//                 ref={(el) => (inputRefs.current[index] = el)}
//               />
//             ))}
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             Verify OTP
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <button
//             type="button"
//             className="text-blue-500 hover:underline"
//             onClick={() => alert("Resend OTP")}
//           >
//             Resend OTP
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OTPVerify;
import { useAuth } from "./AuthContext"; // Adjust path
import { useNavigate } from "react-router-dom";

const OTPVerificationPage = () => {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const handleVerify = () => {
    // Example OTP logic: replace with real validation
    const success = true; // Set to true or false based on your OTP validation logic
    if (success) {
      verifyOtp(); // Mark as verified
      navigate("/dashboard"); // Go to next page
    }
  };
  return (
    <div>
      {/* Your OTP form */}
    </div>
  );
};

export default OTPVerificationPage;
