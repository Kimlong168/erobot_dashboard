const validateEmail = (inputEmail) => {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the inputEmail against the regex pattern
    const isValid = emailRegex.test(inputEmail);
    
    // Update the state to indicate whether the email is valid
    return isValid;
  };
  
  export default validateEmail;