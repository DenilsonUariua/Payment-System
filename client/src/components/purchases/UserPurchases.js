import React, { useEffect, useState, Fragment, useContext } from "react";
import DataTable from "react-data-table-component";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import axios from "axios";
// import { PurchaseProduct } from "./forms";
import { UserContext } from "@context";
// get api url
const { REACT_APP_AUTH_API_URL } = process.env;

const theme = createTheme();

export const UserPurchases = () => {
  const { user } = useContext(UserContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(undefined);
  // const [open, setOpen] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState(undefined);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // fetch products from api
  useEffect(() => {
    function getData() {
      user && console.log("user", user);
      user &&
        axios
          .get(`${REACT_APP_AUTH_API_URL}/purchases/buyer/${user.buyerId}`)
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
    }
    getData();
    return () => {
      setData(undefined);
    };
  }, [user]);

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = React.useMemo(() => {
    const handleDelete = () => {
      if (
        window.confirm(
          `Are you sure you want to delete:\r ${selectedRows.map(
            (r) => r.title
          )}?`
        )
      ) {
        setToggleCleared(!toggleCleared);
        setData(data.filter((d) => !selectedRows.includes(d)));
      }
    };

    return (
      <Button
        key="delete"
        onClick={handleDelete}
        style={{ backgroundColor: "red" }}
        icon
      >
        Delete
      </Button>
    );
  }, [data, selectedRows, toggleCleared]);
  if (data === undefined) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      name: "Seller",
      selector: (row) => row.sellerId,
      sortable: true
    },
    {
      name: "Purchase Id",
      selector: (row) => row.purchaseId,
      sortable: true
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true
    },
    {
      name: "Actions",
      selector: (row) => (
        <Fragment>
          <Link>
            <Button
              variant="outlined"
              onClick={() => {
                // setSelectedProduct(row);
                // handleClickOpen();
              }}
            >
              PAY
            </Button>
          </Link>
        </Fragment>
      ),
      sortable: true
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="lg"
        style={{
          marginTop: "5%",
          boxShadow: "0 0 16px 0 rgba(0,0,0,0.7)"
        }}
      >
        <DataTable
          title="Your Verified Purchases"
          columns={columns}
          data={data}
          selectableRows
          contextActions={contextActions}
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}
          pagination
        />
      </Container>
    </ThemeProvider>
  );
};
