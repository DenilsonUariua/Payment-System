import { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Formik, Form } from "formik";
import { userModel } from "./models/userModel";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../use-context/UserContext";
import { Notification } from "@helpers/notifications";
import { signinValidationSchema } from "./validationSchemas/signin.schema";
import { EP_TEXTFIELD } from "@helpers/form";

import axios from "axios";
// get api url
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
      <Link color="inherit" href="/">
        Kanry Payment
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export function SignInCustomer() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        style={{
          boxShadow: "0 0 16px 0 rgba(0,0,0,0.7)",
          backgroundColor: "white",
          marginBottom: "1rem",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign In As Customer
          </Typography>
          <Formik
            initialValues={userModel}
            validationSchema={signinValidationSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={(values, { setSubmitting }) => {
              axios
                .post(
                  `${
                    NODE_ENV === "production"
                      ? REACT_APP_AUTH_API_URL_PRODUCTION
                      : REACT_APP_AUTH_API_URL_DEVELOPMENT
                  }/customer/signin`,
                  values
                )
                .then((res) => {
                  const { data } = res;
                  localStorage.setItem("user", JSON.stringify(data));
                  setUser(data);
                  Notification("Success", `Welcome back ${data.fullname}`);
                  setSubmitting(false);
                  navigate("/products", { state: { data } }, { replace: true });
                })
                .catch((err) => {
                  Notification("Error", `Incorrect email or password`);
                  console.log(err);
                  setSubmitting(false);
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
                <EP_TEXTFIELD
                  width={12}
                  name="email"
                  required={true}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  label="Email Address"
                  errors={errors}
                  touched={touched}
                  value={values.email}
                  disabled={isSubmitting}
                />
                {/* add space */}
                <Box sx={{ mt: 1 }} />
                <EP_TEXTFIELD
                  type="password"
                  name="password"
                  required={true}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  label="Password"
                  errors={errors}
                  touched={touched}
                  value={values.password}
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>
          <Grid container>
            <Grid item>
              <Link to={"/signup"}>{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
