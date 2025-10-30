import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "Components/auth/SignupValidation"; // Ensure this path is correct
import axios from "axios";
// Corrected import: Use the exported 'labOptions'
import { labOptions } from "Components/data/lab"; // Ensure this path is correct

function Signup() {
  const [values, setValues] = useState({
    name: "",
    designation: "",
    lab: "", // Store the selected lab value (string)
    email: "",
    phoneNumber: "",
    password: "",
    employeeId: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = Validation(values); // Call your validation function
    setErrors(validationErrors);

    // Check if there are NO validation errors
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://172.16.2.246:8080/auth/register", // Make sure this is your correct registration endpoint
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response data:", response.data); // Log response for debugging

        // Check for successful status (e.g., 200 OK or 201 Created)
        if (response.status === 201 || response.status === 200) {
          // eslint-disable-next-line no-undef
          Swal.fire({ // Use Swal for better alerts
             title: "Success!",
             text:"Registration successful!",
             icon: "success",
             confirmButtonText: "OK"
          }).then(() => {
             navigate("/login"); // Redirect after success
          });
        } else {
          // Handle specific error messages from the backend if available
           // eslint-disable-next-line no-undef
           Swal.fire("Error", response.data?.message || "Registration failed. Please check your details.", "error");
        }
      } catch (error) {
        console.error("Signup error:", error.response?.data || error.message); // Log more detailed error
        // Show specific error from backend if available, otherwise generic
        // eslint-disable-next-line no-undef
        Swal.fire("Error", error.response?.data?.message || "Something went wrong during registration.", "error");
      }
    } else {
       console.log("Validation Errors:", validationErrors); // Log validation errors if any
       // eslint-disable-next-line no-undef
       Swal.fire("Validation Error", "Please fix the errors in the form.", "warning");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-200 to-indigo-200 overflow-y-auto py-10"> {/* Allow vertical scroll */}
      <div className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[38%] bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4"> {/* Increased space */}
          <Input label="Name" name="name" type="text" value={values.name} onChange={handleInput} error={errors.name} />
          <Input label="Employee ID" name="employeeId" type="text" value={values.employeeId} onChange={handleInput} error={errors.employeeId} />

          {/* Designation Dropdown */}
          <div>
            <label htmlFor="designation" className="block text-sm font-medium mb-1 text-gray-700">Designation</label>
            <select
              id="designation"
              name="designation"
              value={values.designation}
              onChange={handleInput}
              className={`w-full p-2 border rounded ${errors.designation ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}
            >
              <option value="">Select Designation</option>
              <option value="Director/Head">Director/Head</option>
              <option value="Chief Scientist">Chief Scientist</option>
              <option value="Senior Principal Scientist">Senior Principal Scientist</option>
              <option value="Principal Scientist">Principal Scientist</option> {/* Added Principal Scientist */}
              <option value="Senior Scientist">Senior Scientist</option>
              <option value="Scientist">Scientist</option>
              <option value="Technical Officer">Technical Officer</option>
              <option value="Technical Assistant">Technical Assistant</option>
              {/* Add other relevant designations */}
            </select>
            {errors.designation && <Error text={errors.designation} />}
          </div>

          {/* Lab Dropdown */}
          <div>
            <label htmlFor="lab" className="block text-sm font-medium mb-1 text-gray-700">CSIR Lab / Institute</label>
            <select
              id="lab"
              name="lab"
              value={values.lab}
              onChange={handleInput}
              className={`w-full p-2 border rounded ${errors.lab ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}
            >
              <option value="">Select Lab / Institute</option>
              {/* Corrected: Map over labOptions */}
              {labOptions.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            {errors.lab && <Error text={errors.lab} />}
          </div>

          <Input label="Mobile Number" name="phoneNumber" type="tel" value={values.phoneNumber} onChange={handleInput} error={errors.phoneNumber} />
          <Input label="CSIR Email ID" name="email" type="email" value={values.email} onChange={handleInput} error={errors.email} />
          <Input label="Password" name="password" type="password" value={values.password} onChange={handleInput} error={errors.password} />

          <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 transition duration-150 ease-in-out font-semibold">
            Sign Up
          </button>

          <p className="text-center text-sm font-medium mt-4 text-gray-600">
            Already have an account?{' '}
            <Link to="/Login" className="text-indigo-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// Input component remains the same
const Input = ({ label, name, type, value, onChange, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'} focus:border-indigo-500 outline-none`}
      placeholder={`Enter your ${label.toLowerCase()}`} // Use lowercase placeholder
    />
    {error && <Error text={error} />}
  </div>
);

// Error component remains the same
const Error = ({ text }) => (
  <p className="text-red-600 text-xs mt-1">{text}</p> // Slightly darker red
);

export default Signup;