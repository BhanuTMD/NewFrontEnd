function Validation(values) {
  let error = {};

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // 🔧 Removed minimum 8 characters condition
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]+$/;

  if (!values.email) {
    error.email = "Email should not be empty";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Invalid email format";
  }

  if (!values.password) {
    error.password = "Please enter password";
  } else if (!password_pattern.test(values.password)) {
    error.password = "Password must contain at least 1 uppercase, 1 lowercase and 1 digit";
  }

  return error;
}

export default Validation;

//   const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;