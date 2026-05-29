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
