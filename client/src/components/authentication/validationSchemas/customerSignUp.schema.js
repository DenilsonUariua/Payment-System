import * as yup from "yup";

export const customerSignUpValidationSchema = yup.object().shape({
  fullname: yup.string().required("Fullname is required"),
  idNumber: yup.string().required("ID Number is required"),
  cellphone: yup.string().required("Cellphone is required"),
  altCellphone: yup.string().required("Alternative cellphone is required"),
  email: yup.string().required("Email address is required"),
  address: yup.string().required("Address is required"),
  password: yup.string().required("Password is required"),
  idUrl: yup.string().required("ID URL is required"),
  waterElecBillUrl: yup
    .string()
    .required("Water and electricity bill URL is required"),
  policeClearanceUrl: yup.string().required("Police clearance URL is required"),
});
