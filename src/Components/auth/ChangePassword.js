// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PValidation from "./PasswordValidation"; // Assume you have a ChangePasswordValidation function
// import axios from "axios";

// function ChangePassword() {
//   const [values, setValues] = useState({
//     emailId: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const navigate = useNavigate();
//   const [errors, setErrors] = useState({});

//   const handleInput = (event) => {
//     setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
//   };

//   const handleSubmit = async (event) => {
//     // Prevent default only if called from the form submission
//     if (event) event.preventDefault();
//     console.log("handleSubmit called");

//     const validationErrors = PValidation(values);
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       try {
//         const response = await axios.post(
//           "http://localhost:8081/change-password",
//           values
//         );
//         if (response?.data?.message) {
//           console.log("Password changed successfully");
//           navigate("/");
//         } else {
//           console.error("Unexpected response:", response.data);
//         }
//       } catch (error) {
//         console.error("Error changing password:", error);
//         setErrors({ api: "Failed to change password. Please try again." });
//       }
//     }
//   };

//   return (
//     <div className="flex justify-center items-center bg-secondary bg-gradient h-screen">
//       <div className="bg-red-300 p-16 w-[33%] border-slate-200 rounded-lg border-2">
//         <h2 className="text-xl font-bold mb-3">Change Password</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3 flex justify-between">
//             <label htmlFor="emailId" className="font-bold">
//               Email Address
//             </label>
//             <input
//               id="emailId"
//               type="email"
//               placeholder="Enter Your Email Address"
//               value={values.emailId}
//               name="emailId"
//               onChange={handleInput}
//               className="form-control rounded-0 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             />
//             {errors.emailId && (
//               <span className="text-danger">{errors.emailId}</span>
//             )}
//           </div>
//           <div className="mb-3 flex justify-between">
//             <label
//               htmlFor="newPassword"
//               className="font-bold hover:text-indigo-600"
//             >
//               New Password
//             </label>
//             <input
//               id="newPassword"
//               type="password"
//               placeholder="Enter Your New Password"
//               name="newPassword"
//               onChange={handleInput}
//               className="form-control rounded-0 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             />
//             {errors.newPassword && (
//               <span className="text-danger">{errors.newPassword}</span>
//             )}
//           </div>
//           <div className="mb-3 flex justify-between">
//             <label
//               htmlFor="confirmPassword"
//               className="font-bold hover:text-indigo-600"
//             >
//               Confirm Password
//             </label>
//             <input
//               id="confirmPassword"
//               type="password"
//               placeholder="Confirm your new password"
//               name="confirmPassword"
//               onChange={handleInput}
//               className="form-control rounded-0 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             />
//             {errors.confirmPassword && (
//               <span className="text-danger">{errors.confirmPassword}</span>
//             )}
//           </div>
//           {errors.api && <div className="text-danger">{errors.api}</div>}
//           <div className="text-center">
//             <button
//               type="button" // Change this to "button" to prevent default form submission
//               onClick={handleSubmit} // Call handleSubmit on click
//               className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
//             >
//               Change Password
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ChangePassword;
