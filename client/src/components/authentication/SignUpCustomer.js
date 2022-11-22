import { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { customerModel } from "./models/customerModel";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../use-context/UserContext";
import { Notification } from "@helpers/notifications";
import { signupValidationSchema } from "./validationSchemas/signup.schema";
import { EP_TEXTFIELD } from "@helpers/form";
import axios from "axios";
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

export function SignUpCustomer() {
  // use navigate from react router dom
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [id, setId] = useState("");
  const [waterElec, setWaterElec] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  async function uploadID(file) {
    if (id == null) return;
    const result = await uploadFile(file);
    return result;
  }
  async function uploadWaterElec(file) {
    if (waterElec == null) return;
    const result = await uploadFile(file);
    return result;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="sm"
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
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <AccountCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up As Customer
          </Typography>

          <Formik
            initialValues={customerModel}
            // validationSchema={signupValidationSchema}
            // validateOnChange={true}
            // validateOnBlur={true}
            onSubmit={(values, { setSubmitting }) => {
              // submit data to api
              axios
                .post(
                  `${
                    NODE_ENV === "production"
                      ? REACT_APP_AUTH_API_URL_PRODUCTION
                      : REACT_APP_AUTH_API_URL_DEVELOPMENT
                  }/create/customer`,
                  values
                )
                .then((res) => {
                  const { data } = res;
                  Notification("Success", `Welcome ${data.fullname}`);
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
              isSubmitting,
              /* and other goodies */
            }) => (
              <Form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <EP_TEXTFIELD
                    name="fullname"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Fullname"
                    errors={errors}
                    touched={touched}
                    value={values.fullname}
                    disabled={isSubmitting}
                  />
                  <EP_TEXTFIELD
                    name="idNumber"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="ID number"
                    errors={errors}
                    touched={touched}
                    value={values.idNumber}
                    disabled={isSubmitting}
                  />
                  <EP_TEXTFIELD
                    name="cellphone"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Cellphone number"
                    errors={errors}
                    touched={touched}
                    value={values.cellphone}
                    disabled={isSubmitting}
                  />
                  <EP_TEXTFIELD
                    name="altCellphone"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Alternative Cellphone number"
                    errors={errors}
                    touched={touched}
                    value={values.altCellphone}
                    disabled={isSubmitting}
                  />
                  <EP_TEXTFIELD
                    width={12}
                    name="email"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Email Address"
                    errors={errors}
                    touched={touched}
                    value={values.email}
                    disabled={isSubmitting}
                  />
                  <EP_TEXTFIELD
                    width={12}
                    name="address"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Residential Address"
                    errors={errors}
                    touched={touched}
                    value={values.address}
                    disabled={isSubmitting}
                  />
                  <EP_TEXTFIELD
                    type="password"
                    width={12}
                    name="password"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    label="Password"
                    errors={errors}
                    touched={touched}
                    value={values.password}
                    disabled={isSubmitting}
                  />
                  <Container style={{ padding: "1rem", width: "50%" }}>
                    <label for="file">Upload certified ID copy</label>
                    <input
                      type="file"
                      required
                      accept=".pdf"
                      onChange={async (e) => {
                        setUploading(true);
                        setId(e.target.files[0]);
                        const url = await uploadID(e.target.files[0]);
                        values.idUrl = url;
                        setUploading(false);
                      }}
                      style={{ width: "100%", overflow: "hidden" }}
                    />
                  </Container>
                  <Container style={{ padding: "1rem", width: "50%" }}>
                    <label for="file">Upload Water or Electricity bill</label>
                    <input
                      type="file"
                      required
                      accept=".pdf"
                      onChange={async (e) => {
                        setUploading(true);
                        setWaterElec(e.target.files[0]);
                        const url = await uploadWaterElec(e.target.files[0]);
                        values.waterElecBillUrl = url;
                        setUploading(false);
                      }}
                      style={{ width: "100%", overflow: "hidden" }}
                    />
                  </Container>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up As Customer
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
