import React, { useEffect, useState, Fragment } from "react";
import DataTable from "react-data-table-component";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import axios from "axios";
// get api url
const { REACT_APP_AUTH_API_URL } = process.env;

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true
  },
  {
    name: "Price",
    selector: (row) => row.price,
    sortable: true
  },
  {
    name: "Description",
    selector: (row) => row.description,
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
          <Button variant="outlined">BUY</Button>
        </Link>
      </Fragment>
    ),
    sortable: true
  }
];

const theme = createTheme();

export const Products = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(undefined);

  // fetch products from api
  useEffect(() => {
    axios
      .get(`${REACT_APP_AUTH_API_URL}/products`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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