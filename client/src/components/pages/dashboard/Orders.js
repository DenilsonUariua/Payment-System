import React, { useEffect, useContext, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import axios from "axios";
import Button from "@mui/material/Button";
import { UserContext } from "@context";
// get api url
const {
  REACT_APP_AUTH_API_URL_PRODUCTION,
  REACT_APP_AUTH_API_URL_DEVELOPMENT,
  NODE_ENV,
} = process.env;

export default function Orders() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const fetchPurchases = () => {
    user &&
      axios
        .get(
          `${
            NODE_ENV === "production"
              ? REACT_APP_AUTH_API_URL_PRODUCTION
              : REACT_APP_AUTH_API_URL_DEVELOPMENT
          }/user-purchases/${user.buyerId}`
        )
        .then((res) => {
          setProducts(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  useEffect(() => {
    fetchPurchases();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const handleConfirmation = (purchase) => {
    axios
      .get(
        `${
          NODE_ENV === "production"
            ? REACT_APP_AUTH_API_URL_PRODUCTION
            : REACT_APP_AUTH_API_URL_DEVELOPMENT
        }/purchases/buy/${purchase._id}`
      )
      .then(() => {
        fetchPurchases();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return !loading ? (
    <React.Fragment>
      <Title>Purchases</Title>
      {products.length > 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Seller</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Purchase ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Sale Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{`${row.sellerId.firstName} ${row.sellerId.lastName}`}</TableCell>
                <TableCell>{`${row.buyerId.firstName} ${row.buyerId.lastName}`}</TableCell>
                <TableCell>{row.productId.name}</TableCell>
                <TableCell>{row.purchaseId}</TableCell>
                <TableCell>{row.productId.description}</TableCell>
                <TableCell align="right">{`${`N$${row.productId.price}`}`}</TableCell>
                <TableCell>{`${row.productId.status}`}</TableCell>
                <TableCell>
                  {row.productId.status === "Paid Awaiting Delivery" ? (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleConfirmation(row);
                      }}
                    >
                      Confirm Delivery
                    </Button>
                  ) : (
                    "None"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        "No Purchases"
      )}
    </React.Fragment>
  ) : (
    "Loading..."
  );
}
