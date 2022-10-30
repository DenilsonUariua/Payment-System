import React, { useContext } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import { blue } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import { UserContext } from "@context";

import axios from "axios";

const { REACT_APP_AUTH_API_URL } = process.env;

export function PurchaseProduct(props) {
  const { onClose, selectedProduct, open, getData } = props;
  const { user, setUser } = useContext(UserContext);
  console.log("selectedValue: ", user);

  const handleClose = () => {
    onClose(selectedProduct);
  };
  const handlePurchase = () => {
    axios
      .post(`${REACT_APP_AUTH_API_URL}/purchase`, {
        buyerId: user.buyerId,
        sellerId: selectedProduct.sellerId,
        productId: selectedProduct._id,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        getData();
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Dialog onClose={handleClose} open={open} fullScreen>
      <DialogTitle>
        Purchase {`${selectedProduct && selectedProduct.name}`}
      </DialogTitle>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Typography
            variant="body2"
            color="text.secondary"
            align="left"
            style={{ paddingLeft: "3rem" }}
          >
            Name: {`${selectedProduct && selectedProduct.name}`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography
            variant="body2"
            color="text.secondary"
            align="left"
            style={{ paddingLeft: "3rem" }}
          >
            Price: {`${selectedProduct && selectedProduct.price}`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography
            variant="body2"
            color="text.secondary"
            align="left"
            style={{ paddingLeft: "3rem" }}
          >
            Description: {`${selectedProduct && selectedProduct.description}`}
          </Typography>
        </Grid>
      </Grid>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handlePurchase}>Purchase</Button>
      </DialogActions>
    </Dialog>
  );
}

PurchaseProduct.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
