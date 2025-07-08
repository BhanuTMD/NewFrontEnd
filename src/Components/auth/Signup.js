import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "Components/auth/SignupValidation";
import axios from "axios";
// import { lab } from "Components/pages/techSearch/techSearchOptions";
import { lab } from "Components/data/lab";
function Signup() {
  const [values, setValues] = useState({
    name: "",
    designation: "",
    lab: "",
    email: "",
    phoneNumber: "",
    password: "",
    employeeId: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = Validation(values); setErrors(validationErrors);
    if (
      values.name &&
      values.designation &&
      values.lab &&
      values.email &&
      values.phoneNumber &&
      values.password &&
      values.employeeId
    )  {
    try {
      const response = await axios.post(
        "http://172.16.2.246:8181/auth/register",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response data:", response.data);
      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong during registration.");
    }
  }
};
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-200 to-indigo-200 overflow-hidden">
      <div className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[38%] bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Sign-Up</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Name" name="name" type="text" value={values.name} onChange={handleInput} error={errors.name} />
          <Input label="Employee ID" name="employeeId" type="text" value={values.employeeId} onChange={handleInput} error={errors.employeeId} />
          <div>
            <label className="block text-sm font-medium mb-1">Designation</label>
            <select
              name="designation"
              value={values.designation}
              onChange={handleInput}
              className="w-full p-2 border rounded"
            >
              <option value="">Select designation</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="project_manager">Project Manager</option>
              <option value="qa">QA Engineer</option>
            </select>
            {errors.designation && <Error text={errors.designation} />}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CSIR-Lab</label>
            <select
              name="lab"
              value={values.lab}
              onChange={handleInput}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Lab</option>
              {lab.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            {errors.lab && <Error text={errors.lab} />}
          </div>
          <Input label="Mobile Number" name="phoneNumber" type="tel" value={values.phoneNumber} onChange={handleInput} error={errors.phoneNumber} />
          <Input label="CSIR Email ID" name="email" type="email" value={values.email} onChange={handleInput} error={errors.email} />
          <Input label="Password" name="password" type="password" value={values.password} onChange={handleInput} error={errors.password} />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-full hover:bg-green-700">
            Sign Up
          </button>
          <p className="text-center text-sm font-medium mt-2">
            Already have an account?{' '}
            <Link to="/Login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
const Input = ({ label, name, type, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
      placeholder={`Enter your ${label}`}
    />
    {error && <Error text={error} />}
  </div>
);
const Error = ({ text }) => (
  <p className="text-red-500 text-xs mt-1">{text}</p>);
export default Signup;
