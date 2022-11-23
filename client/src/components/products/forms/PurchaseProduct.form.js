import { useContext } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import { UserContext } from "@context";
import axios from "axios";

const {
  REACT_APP_AUTH_API_URL_PRODUCTION,
  REACT_APP_AUTH_API_URL_DEVELOPMENT,
  NODE_ENV
} = process.env;
export function PurchaseProduct(props) {
  const { onClose, selectedProduct, open, getData } = props;
  const { user } = useContext(UserContext);
  const handleClose = () => {
    onClose(selectedProduct);
  };
  const handlePurchase = () => {
    axios
      .post(
        `${
          NODE_ENV === "production"
            ? REACT_APP_AUTH_API_URL_PRODUCTION
            : REACT_APP_AUTH_API_URL_DEVELOPMENT
        }/purchase`,
        {
          buyerId: user.buyerId,
          sellerId: selectedProduct.sellerId,
          productId: selectedProduct._id
        }
      )
      .then((res) => {
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
            Seller name:{" "}
            {`${selectedProduct && selectedProduct.sellerId.fullname}`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography
            variant="body2"
            color="text.secondary"
            align="left"
            style={{ paddingLeft: "3rem" }}
          >
            Seller Email:{" "}
            {`${selectedProduct && selectedProduct.sellerId.email}`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography
            variant="body2"
            color="text.secondary"
            align="left"
            style={{ paddingLeft: "3rem" }}
          >
            Price: {`N$${selectedProduct && selectedProduct.price}`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <img
            src={selectedProduct && selectedProduct.image}
            alt="product"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              margin: "auto 3rem"
            }}
          />
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
  selectedProduct: PropTypes.object.isRequired
};
