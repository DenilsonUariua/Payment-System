import * as yup from "yup";

export const signinValidationSchema = yup.object().shape({
  email: yup.string().required("Email address is required"),
  password: yup.string().required("Password is required")
});
