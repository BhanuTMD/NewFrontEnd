function Validation(values) {
  let error = {};
  // Name
  if (!values.name.trim()) {
    error.name = "Name should not be empty";
  }
  // Employee ID
  if (!values.employeeId.trim()) {
    error.employeeId = "Employee ID should not be empty";
  }
  // Designation
  if (!values.designation) {
    error.designation = "Please select a designation";
  }
  // Lab
  if (!values.lab) {
    error.lab = "Please select a lab";
  }
  // Email
  if (!values.email.trim()) {
    error.email = "Email should not be empty";
  }
  // Phone Number
  if (!values.phoneNumber.trim()) {
    error.phoneNumber = "Phone number should not be empty";
  }
  // Password
  if (!values.password) {
    error.password = "Password should not be empty";
  }
  return error;
}
export default Validation;

