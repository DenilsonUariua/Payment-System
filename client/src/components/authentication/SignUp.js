import { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { userModel } from "./models/userModel";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../use-context/UserContext";
import { Notification } from "@helpers/notifications";
import { signupValidationSchema } from "./validationSchemas/signup.schema";
import { EP_TEXTFIELD } from "@helpers/form";
import axios from "axios";

const {
  REACT_APP_AUTH_API_URL_PRODUCTION,
  REACT_APP_AUTH_API_URL_DEVELOPMENT,
  NODE_ENV
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

export function SignUp() {
  // use navigate from react router dom
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        style={{
          boxShadow: "0 0 16px 0 rgba(0,0,0,0.7)",
          backgroundColor: "white"
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          <Formik
            initialValues={userModel}
            validationSchema={signupValidationSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={(values, { setSubmitting }) => {
              // submit data to api
              axios
                .post(
                  `${
                    NODE_ENV === "production"
                      ? REACT_APP_AUTH_API_URL_PRODUCTION
                      : REACT_APP_AUTH_API_URL_DEVELOPMENT
                  }/signup`,
                  values
                )
                .then((res) => {
                  const { data } = res;
                  Notification("Success", `Welcome ${data.firstName}`);
                  setUser(data);
                  localStorage.setItem("user", JSON.stringify(data));
                  navigate("/dashboard", { state: { data } });
                })
                .catch((err) => {
                  Notification("Error", "Something went wrong");
                  console.log("Error: ", err);
                });
              setSubmitting(false);
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
                  <EP_TEXTFIELD
                    name="firstName"
                    required={true}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="First Name"
                    errors={errors}
                    touched={touched}
                    value={values.firstName}
                    disabled={isSubmitting}
                  />
                  <EP_TEXTFIELD
                    name="lastName"
                    required={true}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Last Name"
                    errors={errors}
                    touched={touched}
                    value={values.lastName}
                    disabled={isSubmitting}
                  />
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
                  <EP_TEXTFIELD
                    type="password"
                    width={12}
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
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
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
