// ** Reactstrap Imports
import { FormFeedback, FormGroup } from "reactstrap";

import { getIn } from "formik";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

export function EP_TEXTFIELD(props) {
  const {
    errors,
    touched,
    name,
    handleChange,
    handleBlur,
    label,
    required = false,
    disabled = false,
    value = "",
    styles = {},
    type = "text",
    autoComplete,
    fullWidth = true,
    width = 6,
  } = props;

  const isErrored = !!(
    getIn(errors, name) && getIn(touched, name) !== undefined
  );

  const style = {
    ...styles
  };

  Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    s = s.replace(/^\./, ""); // strip a leading dot
    const a = s.split(".");
    for (let i = 0, n = a.length; i < n; ++i) {
      const k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  };
  return (
    <Grid item xs={12} sm={width}>
      <FormGroup>
        <TextField
          style={style}
          type={type}
          autoComplete={autoComplete}
          disabled={disabled}
          name={name}
          required={required}
          fullWidth={fullWidth}
          onChange={handleChange}
          onBlur={handleBlur}
          label={label}
          value={value}
        />
        {isErrored && (
          <FormFeedback>
            <div style={{ color: "red" }}>{Object.byString(errors, name)}</div>
          </FormFeedback>
        )}
      </FormGroup>
    </Grid>
  );
}
