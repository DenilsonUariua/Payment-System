import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button } from "reactstrap";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
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
  }
];

const theme = createTheme();

const Products = () => {
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const [data, setData] = React.useState(undefined);

  // fetch products from api
  useEffect(() => {
    axios
      .get(`${REACT_APP_AUTH_API_URL}/products`)
      .then((res) => {
        console.log("Data: ", res.data);
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

export default Products;
