function validatePassword(password) {
  // Define the criteria for a valid password
  const minLength = 6; // Minimum password length
  //   const hasUppercase = /[A-Z]/.test(password); // Check for at least one uppercase letter
  //   const hasLowercase = /[a-z]/.test(password); // Check for at least one lowercase letter
  //   const hasDigit = /\d/.test(password); // Check for at least one digit

  // Check if the password meets all criteria
  const isValid = password.length >= minLength;

  return isValid;
}

export default validatePassword;
