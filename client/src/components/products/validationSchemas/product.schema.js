import * as yup from "yup";

export const productValidationSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Product description is required"),
  price: yup.number().required("Product price is required"),
});
