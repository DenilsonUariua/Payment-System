import { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InventoryIcon from "@mui/icons-material/Inventory";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { ProductModel } from "./models/Product.model";
import { productValidationSchema } from "../validationSchemas/product.schema";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EP_TEXTFIELD } from "@helpers/form";
import { Notification } from "@helpers/notifications";
import { UserContext } from "@context";
import { uploadFile } from "@firebaseFolder";

const {
  REACT_APP_AUTH_API_URL_PRODUCTION,
  REACT_APP_AUTH_API_URL_DEVELOPMENT,
  NODE_ENV,
} = process.env;

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link to={"/"}>Kanry Payment</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export function CreateProduct() {
  // use navigate from react router dom
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  async function upload(file) {
    if (image == null) return;
    const result = await uploadFile(file);
    return result;
  }

  const { user } = useContext(UserContext);
  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        style={{
          boxShadow: "0 0 16px 0 rgba(0,0,0,0.7)",
          backgroundColor: "white",
          marginBottom: "20vh"
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              values.image = url;
              values.sellerId = user.sellerId;
              // submit data to api
              axios
                .post(
                  `${
                    NODE_ENV === "production"
                      ? REACT_APP_AUTH_API_URL_PRODUCTION
                      : REACT_APP_AUTH_API_URL_DEVELOPMENT
                  }/product`,
                  values
                )
                .then(() => {
                  Notification("Success", "Product created successfully");
                  actions.resetForm();
                  setTimeout(() => {
                    actions.setSubmitting(false);
                    navigate("/products");
                  }, 1000);

                  // pass data to login page
                })
                .catch((err) => {
                  Notification("Error", "Product not created");
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
              isSubmitting,
              /* and other goodies */
            }) => (
              <Form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <EP_TEXTFIELD
                    name="name"
                    required={true}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Product Name"
                    errors={errors}
                    touched={touched}
                    value={values.name}
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                  <Container style={{ padding: "1rem", width: "50%" }}>
                    <input
                      type="file"
                      onChange={async (e) => {
                        setUploading(true);
                        setImage(e.target.files[0]);
                        const url = await upload(e.target.files[0]);
                        values.image = url;
                        setUrl(url);
                        setUploading(false);
                      }}
                      style={{ width: "100%", overflow: "hidden" }}
                    />
                  </Container>
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
                    disabled={isSubmitting}
                  />
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting || uploading}
                >
                  {uploading ? "Uploading..." : "Create Product"}
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
