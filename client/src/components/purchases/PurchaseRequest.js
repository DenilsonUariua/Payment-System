import React, { useEffect, useState, Fragment, useContext } from "react";
import DataTable from "react-data-table-component";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { UserContext } from "@context";
const {
  REACT_APP_AUTH_API_URL_PRODUCTION,
  REACT_APP_AUTH_API_URL_DEVELOPMENT,
  NODE_ENV,
} = process.env;
const theme = createTheme();

export const PurchaseRequest = () => {
  const { user } = useContext(UserContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(undefined);

  const handlecConfirmation = (purchase) => {
    axios
      .get(`${NODE_ENV === "production"
      ? REACT_APP_AUTH_API_URL_PRODUCTION
      : REACT_APP_AUTH_API_URL_DEVELOPMENT}/purchases/confirm/${purchase._id}`)
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

  function getData() {
    user &&
      axios
        .get(`${NODE_ENV === "production"
        ? REACT_APP_AUTH_API_URL_PRODUCTION
        : REACT_APP_AUTH_API_URL_DEVELOPMENT}/purchases/seller/${user.sellerId}`)
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
      name: "Buyer name",
      selector: (row) => `${row.buyerId.fullname}`,
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
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                onClick={() => {
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
                  handleRejection(row);
                }}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
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
