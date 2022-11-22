import React, { useState, Fragment } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { SignInCustomer } from "./SignInCustomer";
import { SignInEntrepreneur } from "./SignInEntrepreneur";
import Container from "@mui/material/Container";
export function SignIn() {
  const [type, setType] = useState("");

  const handleChange = (event) => {
    setType(event.target.value);
  };

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box sx={{ minWidth: "40%", backgroundColor: "white", margin: "2%" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            Sign In As A Customer or Entrepreneur
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            label="Sign Up As A Customer or Entrepreneur"
            onChange={handleChange}
            defaultValue="Customer"
          >
            <MenuItem value={"Customer"}>Customer</MenuItem>
            <MenuItem value={"Entrepreneur"}>Entrepreneur</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {type === "Entrepreneur" ? <SignInEntrepreneur /> : <SignInCustomer />}
    </Container>
  );
}
