import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Formik, Form } from "formik";
import { userModel } from "./models/userModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// get api url
const { REACT_APP_AUTH_API_URL } = process.env;

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  useEffect(() => {
    // check if user is logged in
    setTimeout(() => {

    axios
      .get(`${REACT_APP_AUTH_API_URL}/login`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("Resosaon", res);
      })
      .catch((err) => {
        console.log("Errir", err);
      });
    }, 1000);
  }, []);

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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
              axios
                .post(`${REACT_APP_AUTH_API_URL}/login`, values)
                .then((res) => {
                  console.log(res);
                  setSubmitting(false);
                  navigate("/dashboard");
                })
                .catch((err) => {
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
              <Form>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={values.email}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={values.password}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                {/* {console.log(values)} */}
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
