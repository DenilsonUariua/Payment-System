import React, { useEffect, useContext, useState } from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import axios from "axios";
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
  useEffect(() => {
    user && axios
      .get(`${NODE_ENV === "production"
      ? REACT_APP_AUTH_API_URL_PRODUCTION
      : REACT_APP_AUTH_API_URL_DEVELOPMENT}/user-purchases/${user.buyerId}`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  return (
    !loading ? (
      <React.Fragment>
        <Title>Purchases</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Seller ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Purchase ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Sale Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.sellerId}</TableCell>
                <TableCell>{row.productId.name}</TableCell>
                <TableCell>{row.purchaseId}</TableCell>
                <TableCell>{row.productId.description}</TableCell>
                <TableCell align="right">{`${row.productId.price}`}</TableCell>
                <TableCell>{`${row.productId.status}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </React.Fragment>
    ): "Loading..."
  );
}
