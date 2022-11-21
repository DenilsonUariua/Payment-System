import { useEffect, useState, useContext } from "react";
import { Card } from "antd";
import { UserContext } from "@context";
import axios from "axios";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems } from "./dashboard/listItems";

const drawerWidth = 240;
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9)
      }
    })
  }
}));

const mdTheme = createTheme();

const {
  REACT_APP_AUTH_API_URL_PRODUCTION,
  REACT_APP_AUTH_API_URL_DEVELOPMENT,
  NODE_ENV
} = process.env;
const gridStyle = {
  width: "25%",
  textAlign: "center"
};
export const Customers = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [data, setData] = useState(undefined);
  function getData() {
    user &&
      axios
        .get(
          `${
            NODE_ENV === "production"
              ? REACT_APP_AUTH_API_URL_PRODUCTION
              : REACT_APP_AUTH_API_URL_DEVELOPMENT
          }/customers/${user.buyerId}`
        )
        .then((res) => {
          console.log(res.data);
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
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1]
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: "transparent",
            flexGrow: 1,
            height: "100vh",
            overflow: "auto"
          }}
        >
        <Card title="Customers" style={{ margin: "2%" }}>
          {data &&
            data.map((customer) => (
              <Card.Grid style={gridStyle}>
                <Card
                  title={`BUYER: ${customer.buyerId.firstName.toUpperCase()} ${customer.buyerId.lastName.toUpperCase()}`}
                  bordered={false}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "start",
                      alignItems: "start"
                    }}
                  >
                    <p>Buyer email: {customer.buyerId.email}</p>
                    <p>Product name: {customer.productId.name}</p>
                    <p>Product price:{` N$${customer.productId.price}`}</p>
                    <p>Product status:{` ${customer.productId.status}`}</p>
                  </div>
                </Card>
              </Card.Grid>
            ))}
        </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
