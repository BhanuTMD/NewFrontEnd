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


// function Validation(values) {
//   let error = {};
//   const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//   const phone_pattern = /^[0-9]{10}$/; // Assuming 10-digit phone number

//   // Name
//   if (!values.name.trim()) {
//     error.name = "Name should not be empty";
//   }

//   // Employee ID
//   if (!values.employeeId.trim()) {
//     error.employeeId = "Employee ID should not be empty";
//   }

//   // Designation
//   if (!values.designation) {
//     error.designation = "Please select a designation";
//   }

//   // Lab
//   if (!values.lab) {
//     error.lab = "Please select a lab";
//   }

//   // Email
//   if (!values.email.trim()) {
//     error.email = "Email should not be empty";
//   } else if (!email_pattern.test(values.email)) {
//     error.email = "Invalid email format";
//   }

//   // Phone Number
//   if (!values.phoneNumber.trim()) {
//     error.phoneNumber = "Phone number should not be empty";
//   } else if (!phone_pattern.test(values.phoneNumber)) {
//     error.phoneNumber = "Invalid phone number";
//   }

//   // Password
//   if (!values.password) {
//     error.password = "Password should not be empty";
//   } else if (!password_pattern.test(values.password)) {
//     error.password = "Password must be at least 8 characters and include a number";
//   }

//   return error;
// }

// export default Validation;
