import React, { useEffect, useState, Fragment } from "react";
import DataTable from "react-data-table-component";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import axios from "axios";
import { PurchaseProduct } from "./forms";
// get api url
const {
  REACT_APP_AUTH_API_URL_PRODUCTION,
  REACT_APP_AUTH_API_URL_DEVELOPMENT,
  NODE_ENV,
} = process.env;
const theme = createTheme();

export const Products = () => {
  // const {user} = useContext(UserContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(undefined);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedProduct(value);
  };
  
  function getData() {
    axios
      .get(`${NODE_ENV === "production"
      ? REACT_APP_AUTH_API_URL_PRODUCTION
      : REACT_APP_AUTH_API_URL_DEVELOPMENT}/products`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // fetch products from api
  useEffect(() => {
    getData();
    return () => {
      setData(undefined);
    };
  }, []);

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
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => `N$${row.price}`,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <Fragment>
          <Link>
            <Button
            disabled={row.status !== "Available"}
              variant="outlined"
              onClick={() => {
                setSelectedProduct(row);
                handleClickOpen();
              }}
            >
              BUY
            </Button>
          </Link>
        </Fragment>
      ),
      sortable: true,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="lg"
        style={{
          marginTop: "2%",
          boxShadow: "0 0 16px 0 rgba(0,0,0,0.7)",
        }}
      >
        <PurchaseProduct
          selectedProduct={selectedProduct}
          open={open}
          onClose={handleClose}
          getData={getData}
        />
        <DataTable
          title="Products"
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
