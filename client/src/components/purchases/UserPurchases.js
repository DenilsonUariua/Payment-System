import React, { useEffect, useState, Fragment, useContext } from "react";
import DataTable from "react-data-table-component";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
// import { PurchaseProduct } from "./forms";
import { UserContext } from "@context";
// get api url
const {
  REACT_APP_AUTH_API_URL_PRODUCTION,
  REACT_APP_AUTH_API_URL_DEVELOPMENT,
  NODE_ENV,
} = process.env;
const theme = createTheme();

export const UserPurchases = () => {
  const { user } = useContext(UserContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(undefined);

  function getData() {
    user &&
      axios
        .get(`${NODE_ENV === "production"
        ? REACT_APP_AUTH_API_URL_PRODUCTION
        : REACT_APP_AUTH_API_URL_DEVELOPMENT}/purchases/buyer/${user.buyerId}`)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handlePayment = (purchase) => {
    axios
      .get(`${NODE_ENV === "production"
      ? REACT_APP_AUTH_API_URL_PRODUCTION
      : REACT_APP_AUTH_API_URL_DEVELOPMENT}/purchases/pay/${purchase._id}`)
      .then((res) => {
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleRejection = (purchase) => {
    axios
      .get(`${NODE_ENV === "production"
      ? REACT_APP_AUTH_API_URL_PRODUCTION
      : REACT_APP_AUTH_API_URL_DEVELOPMENT}/purchases/reject/${purchase._id}`)
      .then((res) => {
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
      selector: (row) => `${row.sellerId.firstName} ${row.sellerId.lastName}`,
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
          <Button
            variant="outlined"
            onClick={() => {
              handlePayment(row);
            }}
          >
            PAY
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              handleRejection(row);
            }}
          >
            CANCEL
          </Button>
        </Fragment>
      ),
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="lg"
        style={{
          marginTop: "5%",
          boxShadow: "0 0 16px 0 rgba(0,0,0,0.7)",
          backgroundColor: "transparent",
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
