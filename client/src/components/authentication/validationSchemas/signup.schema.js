import * as yup from "yup";

export const signupValidationSchema = yup.object().shape({
  firstName: yup.string().required("Firstname is required"),
  lastName: yup.string().required("Lastname is required"),
  email: yup.string().required("Email address is required"),
  password: yup.string().required("Password is required"),
});
