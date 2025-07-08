function Validation(values) {
  let error = {};

  // Email
  if (!values.email.trim()) {
    error.email = "Email should not be empty";
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

//   // Email
//   if (!values.email.trim()) {
//     error.email = "Email should not be empty";
//   } else if (!email_pattern.test(values.email)) {
//     error.email = "Invalid email format";
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
