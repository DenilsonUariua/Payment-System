import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import Link from browser router
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { ProductModel } from "../models/Product.model";
import { productValidationSchema } from "../validationSchemas/product.schema";
// import useNavigate from react router dom
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EP_TEXTFIELD } from "../../../helpers/form/EP_TEXTFIELD";

// socket io
import { io } from "socket.io-client";
const { REACT_APP_AUTH_API_URL } = process.env;
const socket = io(REACT_APP_AUTH_API_URL);

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link to={"/"}>Your Website</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function CreateProduct() {
  // use navigate from react router dom
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        style={{
          boxShadow: "0 0 16px 0 rgba(0,0,0,0.7)"
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <InventoryIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create Product
          </Typography>

          <Formik
            initialValues={ProductModel}
            validationSchema={productValidationSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={(values, actions) => {
              actions.setSubmitting(true);

              // submit data to api
              console.log("values: ", values);
              axios
                .post(`${REACT_APP_AUTH_API_URL}/product`, values)
                .then((res) => {
                  const { data } = res;
                  // redirect to login page
                  console.log("data", data);
                  actions.setSubmitting(false);
                  actions.resetForm();
                  // pass data to login page
                  //   navigate("/dashboard", { state: { data } });
                })
                .catch((err) => {
                  console.log("Error: ", err);
                  actions.setSubmitting(false);
                });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
              /* and other goodies */
            }) => (
              <Form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {console.log("values", values)}
                  <EP_TEXTFIELD
                    name="name"
                    required={true}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Product Name"
                    errors={errors}
                    touched={touched}
                    value={values.name}
                  />
                  <EP_TEXTFIELD
                    name="description"
                    required={true}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Description"
                    errors={errors}
                    touched={touched}
                    value={values.description}
                  />
                  <EP_TEXTFIELD
                    type="url"
                    name="image"
                    required={true}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Image Url"
                    errors={errors}
                    touched={touched}
                    value={values.image}
                  />
                  <EP_TEXTFIELD
                    type="number"
                    name="price"
                    required={true}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Price"
                    errors={errors}
                    touched={touched}
                    value={values.price}
                  />
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Create Product
                </Button>
              </Form>
            )}
          </Formik>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to={"/signin"}>Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
