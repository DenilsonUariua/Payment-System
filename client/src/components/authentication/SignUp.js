import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
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
import axios from "axios";

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

export function SignUp() {
  // use navigate from react router dom
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        style={{
          boxShadow: "0 0 16px 0 rgba(0,0,0,0.7)",
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          <Formik
            initialValues={userModel}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              // submit data to api
              axios
                .post(`${REACT_APP_AUTH_API_URL}/signup`, values)
                .then((res) => {
                  const { data } = res;                  
                  // redirect to login page
                  localStorage.setItem("user", JSON.stringify(data));
                  // pass data to login page
                  navigate("/dashboard", { state: { data } });
                })
                .catch((err) => {
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
              isSubmitting,
              /* and other goodies */
            }) => (
              <Form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="First Name"
                      value={values.firstName}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="lastName"
                      value={values.lastName}
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={values.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="new-password"
                      value={values.password}
                    />
                  </Grid>
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
