import React, { useEffect, useState, Fragment, useContext } from "react";
import DataTable from "react-data-table-component";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { UserContext } from "@context";
const { REACT_APP_AUTH_API_URL } = process.env;

const theme = createTheme();

export const PurchaseRequest = () => {
  const { user } = useContext(UserContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(undefined);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handlecConfirmation = (purchase) => {
    axios
      .get(`${REACT_APP_AUTH_API_URL}/purchases/confirm/${purchase._id}`)
      .then((res) => {
        console.log(res);
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };
const handleRejection = (purchase) => {
    axios
        .get(`${REACT_APP_AUTH_API_URL}/purchases/reject/${purchase._id}`)
        .then((res) => {
            console.log(res);
            getData();
        })
        .catch((err) => {
            console.log(err);
        });
};

  const handleClose = (value) => {
    setOpen(false);
    setSelectedPurchase(value);
  };

  function getData() {
    user &&
      axios
        .get(`${REACT_APP_AUTH_API_URL}/purchases/seller/${user.sellerId}`)
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
      name: "Buyer Id",
      selector: (row) => row.buyerId,
      sortable: true,
    },
    {
      name: "Purchase Id",
      selector: (row) => row.purchaseId,
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
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedPurchase(row);
                  handlecConfirmation(row);
                }}
              >
                Confirm
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedPurchase(row);
                  handleRejection(row);
                }}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
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
          marginTop: "5%",
          boxShadow: "0 0 16px 0 rgba(0,0,0,0.7)",
        }}
      >
        <DataTable
          title="Pending Purchase Request"
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