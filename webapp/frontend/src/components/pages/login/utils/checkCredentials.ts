export const getNewAccountInformationsErrors = (
  email: string,
  password: string,
  passwordConfirmation: string,
  firstName: string,
  lastName: string
) => {
  if (email.length < 1) {
    return "Email cannot be empty";
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Email is not valid";
  }

  if (password.length < 1) {
    return "Password cannot be empty";
  }

  if (passwordConfirmation.length < 1) {
    return "Password confirmation cannot be empty";
  }

  if (password !== passwordConfirmation) {
    return "Passwords do not match";
  }

  if (firstName.length < 1) {
    return "First name cannot be empty";
  }

  if (lastName.length < 1) {
    return "Last name cannot be empty";
  }

  return "";
};
