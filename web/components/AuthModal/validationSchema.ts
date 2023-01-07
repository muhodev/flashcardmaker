import * as yup from "yup";

export const loginValidationSchema = () =>
  yup.object().shape({
    email: yup
      .string()
      .email("Email must be valid")
      .required("Email field is required"),
    password: yup
      .string()
      .required("Password field is required")
      .min(6, "Password field must be greater than 6 character"),
  });

export const registerValidationSchema = () =>
  yup.object().shape({
    email: yup
      .string()
      .email("Email must be valid")
      .required("Email field is required"),
    password: yup
      .string()
      .required("Password field is required")
      .min(6, "Password field must be greater than 6 character"),
    confirmPassword: yup
      .string()
      .test("passwords-match", "Passwords are not match", function (value) {
        return this.parent.password === value;
      }),
  });
